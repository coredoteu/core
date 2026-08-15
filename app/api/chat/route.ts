import { createGroq } from "@ai-sdk/groq";
import { createOpenAI } from "@ai-sdk/openai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createDataStreamResponse, streamText, tool } from "ai";
import { z } from "zod";
import { getServerSession, createSupabaseServerClient } from "@/lib/supabase-server";
import { findOrder } from "@/lib/order-lookup";
import { buildMockTrackingPayload } from "@/lib/tracking";
import { buildRoutine } from "@/lib/routine";
import { getActiveBatch } from "@/lib/batches";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const { messages: rawMessages } = await req.json();

  /**
   * Deep-sanitize messages for providers (Gemini) that reject multi-turn
   * conversations containing raw tool-call / tool-result content parts.
   *
   * The Vercel AI SDK can represent tool calls in two different shapes:
   *   1. m.toolInvocations  – an array of { toolName, result, ... }
   *   2. m.content          – an array of parts where part.type === 'tool-call'
   *                           or 'tool-result'
   *
   * Both must be collapsed into plain-text assistant messages so Gemini never
   * receives a turn containing a bare functionCall/functionResponse without the
   * required thought_signature that the SDK doesn't attach on replays.
   */
  function sanitizeForGemini(msgs: any[]): any[] {
    return msgs.map((m) => {
      if (m.role !== "assistant" && m.role !== "tool") return m;

      if (m.role === "tool") {
        const text = Array.isArray(m.content)
          ? m.content
              .map((p: any) => `[tool result for ${p.toolName ?? "unknown"}: ${JSON.stringify(p.result ?? p.content)}]`)
              .join("\n")
          : String(m.content ?? "");
        return { role: "assistant", content: text };
      }

      let textParts: string[] = [];

      if (typeof m.content === "string" && m.content.trim()) {
        textParts.push(m.content.trim());
      } else if (Array.isArray(m.content)) {
        for (const part of m.content) {
          if (part.type === "text" && part.text?.trim()) {
            textParts.push(part.text.trim());
          } else if (part.type === "tool-call") {
          } else if (part.type === "tool-result") {
            textParts.push(`[tool result for ${part.toolName ?? "unknown"}: ${JSON.stringify(part.result)}]`);
          }
        }
      }

      if (Array.isArray(m.toolInvocations)) {
        for (const t of m.toolInvocations) {
          if (t.state === "result" || t.result !== undefined) {
            textParts.push(`[tool ${t.toolName} returned: ${JSON.stringify(t.result)}]`);
          }
        }
      }

      const collapsed = textParts.join("\n").trim();
      return { role: "assistant", content: collapsed || "(no response)" };
    });
  }

  const messages = rawMessages;
  const geminiMessages = sanitizeForGemini(rawMessages);

  const session = await getServerSession();
  const userEmail = session?.user?.email ?? null;
  const supabaseAsUser = await createSupabaseServerClient();

  const orderTools = {
    getRecentOrders: tool({
      description:
        "Fetch the signed-in customer's most recent CORE. orders, including items, totals, currency, payment status, and shipping address. Use this whenever the customer asks about their orders, order status, tracking, deliveries, or past purchases. Never invent order data — always call this tool.",
      parameters: z.object({
        limit: z
          .number()
          .min(1)
          .max(10)
          .default(5)
          .describe("Max number of orders to return, most recent first."),
      }),
      execute: async ({ limit }) => {
        if (!userEmail) {
          return {
            error: "not_authenticated",
            message:
              "no signed-in customer on this session — ask them to sign in to view order history.",
          };
        }
        const { data, error } = await supabaseAsUser
          .from("orders")
          .select(
            "id, stripe_session_id, amount_total, currency, payment_status, created_at, shipping_details, order_items(id, product_id, quantity, price_at_purchase)",
          )
          .order("created_at", { ascending: false })
          .limit(limit);

        if (error) return { error: "query_failed", message: error.message };
        return { orders: data ?? [] };
      },
    }),
    getOrderByReference: tool({
      description:
        "Look up one specific CORE. order by its short order reference (shown to the customer as either the first 8 characters of the order id, or the last part of the Stripe session/payment id).",
      parameters: z.object({
        reference: z.string().describe("The order reference the customer provided."),
      }),
      execute: async ({ reference }) => {
        if (!userEmail) {
          return { error: "not_authenticated" };
        }
        const { data, error } = await supabaseAsUser
          .from("orders")
          .select(
            "id, stripe_session_id, amount_total, currency, payment_status, created_at, shipping_details, order_items(id, product_id, quantity, price_at_purchase)",
          )
          .or(`id.ilike.%${reference}%,stripe_session_id.ilike.%${reference}%`)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (error) return { error: "query_failed", message: error.message };
        if (!data) return { error: "not_found" };
        return { order: data };
      },
    }),
    getTrackingStatus: tool({
      description:
        "Fetch the shipping / tracking status for one of the signed-in customer's orders, " +
        "including carrier, tracking number, and a checkpoint timeline. Use this whenever the " +
        "customer asks 'where is my order', 'has it shipped', or 'track my package'. Never " +
        "invent tracking data.",
      parameters: z.object({
        reference: z
          .string()
          .optional()
          .describe("Order reference the customer gave. Omit to use their most recent order."),
      }),
      execute: async ({ reference }) => {
        if (!userEmail) return { error: "not_authenticated" };
        const { data: order, error } = await findOrder(supabaseAsUser, reference);
        if (error) return { error: "query_failed", message: error.message };
        if (!order) return { error: "not_found" };
        return buildMockTrackingPayload(order);
      },
    }),
    checkOrderChangeEligibility: tool({
      description:
        "Check whether one of the signed-in customer's orders can still be cancelled or have " +
        "its shipping address changed. " +
        "IMPORTANT RULES FOR CANCELLATIONS: " +
        "1. Pre-orders can ONLY be cancelled while the pre-order window is still open (before pre-order close date). " +
        "2. Orders placed during the buffer stock phase cannot be cancelled at all. " +
        "3. Address changes are allowed before the order enters transit.",
      parameters: z.object({
        reference: z.string().describe("Order reference the customer wants to change or cancel."),
        requestType: z.enum(["cancel", "address_change"]),
      }),
      execute: async ({ reference, requestType }) => {
        if (!userEmail) return { error: "not_authenticated" };
        const { data: order, error } = await findOrder(supabaseAsUser, reference);
        if (error) return { error: "query_failed", message: error.message };
        if (!order) return { error: "not_found" };

        const tracking = buildMockTrackingPayload(order);
        const inTransitOrDelivered = ["in_transit", "out_for_delivery", "delivered"].includes(tracking.currentStatus);

        const activeBatch = await getActiveBatch();

        let eligible = false;
        let reason: string | null = null;

        if (order.payment_status !== "paid") {
          eligible = false;
          reason = "order payment has not been completed.";
        } else if (order.cancellation_requested) {
          eligible = false;
          reason = "a cancellation request has already been submitted for this order and is being processed.";
        } else if (inTransitOrDelivered) {
          eligible = false;
          reason = "order is already in transit or delivered and can no longer be changed or cancelled.";
        } else if (requestType === "cancel") {
          const now = new Date();
          const orderDate = new Date(order.created_at);

          if (!activeBatch) {
            eligible = false;
            reason = "cancellation window is currently locked.";
          } else {
            const closeDate = new Date(activeBatch.preorderCloseDate);
            closeDate.setHours(23, 59, 59, 999);

            const wasPurchasedDuringPreorder = orderDate <= closeDate;
            const isPreorderWindowStillOpen = now <= closeDate && activeBatch.phase === "preorder";

            if (!wasPurchasedDuringPreorder) {
              eligible = false;
              reason = "buffer stock orders cannot be cancelled.";
            } else if (!isPreorderWindowStillOpen) {
              eligible = false;
              reason = "the pre-order window for this batch has closed and production is locked.";
            } else {
              eligible = true;
            }
          }
        } else if (requestType === "address_change") {
          eligible = !inTransitOrDelivered;
          reason = eligible ? null : "order is already in transit and shipping address cannot be modified.";
        }

        return {
          orderId: order.id,
          orderRef: order.id.slice(0, 8).toLowerCase(),
          requestType,
          eligible,
          currentStatus: tracking.currentStatus,
          reason,
        };
      },
    }),
    checkReturnEligibility: tool({
      description:
        "Check whether an order is within the 30-day risk-free guarantee window, and whether " +
        "the guarantee has already been used for that product type. Use this whenever the " +
        "customer asks about returns or refunds — never state eligibility without calling it.",
      parameters: z.object({
        reference: z.string().optional().describe("Order reference; omit for the most recent order."),
      }),
      execute: async ({ reference }) => {
        if (!userEmail) return { error: "not_authenticated" };
        const { data: order, error } = await findOrder(supabaseAsUser, reference);
        if (error) return { error: "query_failed", message: error.message };
        if (!order) return { error: "not_found" };

        const tracking = buildMockTrackingPayload(order);
        const isDelivered = tracking.currentStatus === "delivered";

        const daysSince = Math.floor((Date.now() - new Date(order.created_at).getTime()) / 86_400_000);
        const withinWindow = daysSince <= 30;
        const daysRemaining = Math.max(0, 30 - daysSince);

        const { data: claims } = await supabaseAsUser
          .from("guarantee_claims")
          .select("product_scope")
          .eq("order_id", order.id);

        const claimedScopes = new Set((claims ?? []).map((c) => c.product_scope));

        const items = (order.order_items ?? []).map((item: any) => ({
          productId: item.product_id,
          alreadyClaimed: claimedScopes.has(item.product_id) || claimedScopes.has("duo-system-001"),
        }));

        const eligible = isDelivered && withinWindow && items.some((i: any) => !i.alreadyClaimed);

        return {
          orderId: order.id,
          orderRef: order.id.slice(0, 8).toLowerCase(),
          purchasedAt: order.created_at,
          isDelivered,
          currentStatus: tracking.currentStatus,
          daysSince,
          daysRemaining,
          withinWindow,
          items,
          eligible,
          reason: !isDelivered
            ? "order has not been delivered yet. returns can only be requested after receiving your package."
            : !withinWindow
            ? "the 30-day guarantee window has expired."
            : null,
        };
      },
    }),
    getRoutineRecommendation: tool({
      description:
        "Compute a personalized CORE. shampoo/conditioner routine from the customer's hair " +
        "type, scalp condition, and concerns. Use this for any hair-care-advice or 'what " +
        "routine should I use' question. This is CORE. system guidance, not a medical diagnosis.",
      parameters: z.object({
        hairType: z.enum(["oily", "dry", "normal", "damaged", "fine", "thick"]),
        scalpCondition: z.enum(["balanced", "oily", "dry", "sensitive", "flaky"]).optional(),
        concerns: z.array(z.enum(["frizz", "breakage", "volume", "shine", "dandruff", "color-treated"])).optional(),
      }),
      execute: async ({ hairType, scalpCondition, concerns }) => buildRoutine({ hairType, scalpCondition, concerns }),
    }),
    getActiveBatchStatus: tool({
      description:
        "Fetch the current live CORE. batch: phase, pre-order close date, and exact shipping " +
        "window. Use this instead of guessing shipping timelines whenever the customer asks " +
        "when their order ships or when pre-orders close.",
      parameters: z.object({}),
      execute: async () => (await getActiveBatch()) ?? { error: "no_active_batch" },
    }),
    triggerUIAction: tool({
      description:
        "Trigger a frontend UI action instead of a chat card. Use 'open_cart' when the " +
        "customer wants to buy/checkout/see their cart. Use 'prompt_login' when an action " +
        "needs a signed-in account and they aren't authenticated. Use 'scroll_to_waitlist' " +
        "for the v2 waitlist. Use 'navigate_shop' or 'navigate_refunds' to send them to those " +
        "pages. Call this at most once per customer request.",
      parameters: z.object({
        action: z.enum(["open_cart", "prompt_login", "scroll_to_waitlist", "navigate_shop", "navigate_refunds"]),
      }),
      execute: async ({ action }) => {
        return { action, acknowledged: true };
      },
    }),
  };

  console.log("[AI Routing Environment Check]", {
    hasGoogleKey: Boolean(process.env.GOOGLE_GENERATIVE_AI_API_KEY),
    hasGroqKey: Boolean(process.env.GROQ_API_KEY),
    hasOpenRouterKey: Boolean(process.env.OPENROUTER_API_KEY),
  });

  const systemPrompt = `
  CRITICAL RULE 1 (STRICTLY ENFORCED): ALWAYS RESPOND IN THE EXACT SAME LANGUAGE AS THE USER'S LATEST MESSAGE. IF THE USER SPEAKS DUTCH, RESPOND IN DUTCH. IF ENGLISH, RESPOND IN ENGLISH. NEVER DEFAULT TO ENGLISH WHEN THE USER SPEAKS ANOTHER LANGUAGE.

  <identity>
  you are the automated CORE. support system for bycore.eu. you are an ai, fully transparent about this.
  CORE. is a premium, unisex, engineered hair care brand. our mission is to provide high-performance european alternatives to expensive us brands (like based or olaplex) with a minimalist tech-noir aesthetic, clinical precision, and zero import fees. slogan: "refined to the core."
  </identity>

  <behavioral_rules>
  1. strict lowercase: every single word MUST be lowercase. the ONLY exception is the brand name "CORE.", which must always be capitalized with a period.
  2. extreme brevity: maximum 1 to 2 short sentences. be direct, clinical, and solution-oriented.
  3. no em-dashes: never use em-dashes (—). use slashes (/), colons (:), or standard hyphens (-).
  4. no emotional filler: never say "sorry", "i'm happy to help", or "thanks for reaching out". state facts and solutions immediately.
  </behavioral_rules>

  <knowledge_base>
  product specifications:
  - v1 system 001 (swiss lab edition): 290ml white bottles, 98-99% natural origin, ecocert cosmos certified, vegan, silicone-free, ph 4.5-5.5, engineered in the netherlands. signature scent: juicy fruits & warm woods.
  - phase 01 shampoo actives: aloe vera juice, sea kale extract, ginkgo biloba leaf, burdock root.
  - phase 02 conditioner actives: aloe vera, hydrolyzed wheat protein, argan oil, sea kale.
  - v2 (stealth black edition): in development, 250ml matte black, scent: bergamot/cedarwood/peppermint.

  pricing & bundles:
  - system 001 duo pre-order: € 39.95 (regular € 44.95, value € 56.00).
  - single bottles pre-order: € 24.95 (regular € 28.00).
  - shipping: free tracked shipping on all orders over € 50.

  logistics & returns:
  - delivery timeline: 10 days production/transit AFTER pre-order window closes + 1-2 business days (NL/BE) or 2-4 days (EU).
  - cancellation rules: pre-orders can ONLY be cancelled while the pre-order window is still open (before pre-order close date). buffer stock purchases cannot be cancelled. once pre-orders close or orders move to transit, cancellations are locked.
  - 30-day risk-free guarantee: valid ONCE per product type per unique household/email/address/payment method.
  - guarantee rules: claiming "the duo" exhausts future claims. claiming a single bottle leaves the other eligible. opened bottles do not need to be returned; € 5.95 processing fee is deducted from guarantee refunds.
  - unopened returns: accepted within 30 days, customer pays return shipping.
  </knowledge_base>

  <tool_rules>
  - getRecentOrders & getOrderByReference: fetch real order data. if not authenticated, ask user to sign in.
  - getActiveBatchStatus: use for pre-order close & shipping window questions instead of general estimates.
  - getTrackingStatus: use whenever asked where an order is or if it shipped.
  - checkOrderChangeEligibility: use before offering cancellations or address updates. pre-orders can ONLY be cancelled before the pre-order window closes. buffer stock purchases cannot be cancelled at all.
  - checkReturnEligibility: use for 30-day guarantee or return queries. IMPORTANT: returns/guarantees are ONLY possible AFTER delivery. if not delivered yet, inform user returns open upon delivery (or offer order cancellation if unfulfilled).
  - getRoutineRecommendation: use for hair care advice. ask for hair type if missing.
  - triggerUIAction: call 'open_cart' for cart/checkout requests, 'prompt_login' for auth required, 'scroll_to_waitlist' for v2 waitlist, 'navigate_shop' or 'navigate_refunds' to redirect. confirm UI actions using a complete, natural sentence in the user's language (e.g. "i have opened your cart." / "your cart is now open.").
  </tool_rules>
  `.trim();

  const openrouter = createOpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY,
    headers: {
      "HTTP-Referer": "https://bycore.eu",
      "X-Title": "CORE.",
    },
  });

  const groq = createGroq({
    apiKey: process.env.GROQ_API_KEY,
  });

  const google = createGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
  });

  const fallbackModels = [
    { provider: "Google (Gemini)", model: google("gemini-3.5-flash-lite"), isGemini: true },
    { provider: "Groq (GPT-oss)", model: groq("openai/gpt-oss-20b"), isGemini: false },
    { provider: "OpenRouter (GPT-oss)", model: openrouter("openai/gpt-oss-20b:free"), isGemini: false },
    { provider: "Groq (Qwen)", model: groq("qwen/qwen3.6-27b"), isGemini: false },
    { provider: "OpenRouter (Qwen)", model: openrouter("qwen/qwen3.6-27b:free"), isGemini: false },
    { provider: "OpenRouter (Nemotron)", model: openrouter("nvidia/nemotron-3-ultra-550b-a55b:free"), isGemini: false }
  ];

  return createDataStreamResponse({
    execute: async (dataStream) => {
      try {
        const geminiModelInfo = fallbackModels.find(m => m.isGemini);
        if (!geminiModelInfo) throw new Error("Gemini model not configured");

        const stage1 = streamText({
          model: geminiModelInfo.model,
          system: systemPrompt,
          messages: geminiMessages,
          temperature: 0.5,
          maxTokens: 4000,
          tools: orderTools,
          maxSteps: 1, // Prevent SDK from attempting a signature-less replay
        });

        // Forward stage 1's parts (tool call/result) but keep stream open
        // @ts-ignore - Bypass type check for internal sendFinish option
        stage1.mergeIntoDataStream(dataStream, { sendFinish: false, experimental_sendFinish: false });

        const toolCalls = await stage1.toolCalls.catch(() => []);
        const toolResults = await stage1.toolResults.catch(() => []);

        if (!toolCalls || toolCalls.length === 0) return; // Stage 1 was just text

        // Stage 2: Narration without tools, on Groq
        const groqModelInfo = fallbackModels.find(m => m.provider.includes("Groq"));
        if (!groqModelInfo) throw new Error("Groq model not configured");

        const narrationSystem = `
CRITICAL RULE 1: YOU MUST RESPOND IN THE EXACT SAME LANGUAGE AS THE USER'S LATEST MESSAGE. IF THE USER WRITES IN DUTCH, RESPOND IN DUTCH. IF ENGLISH, RESPOND IN ENGLISH.

${systemPrompt}

narration_rules:
- the ui already presents full order cards to the customer. do not restate every item.
- answer their question directly in MAXIMUM 1 TO 2 SHORT SENTENCES.
- if a tool result contains an "action" field, confirm the UI action in one complete, natural sentence in the user's language (e.g. "i have opened your cart." / "your cart is now open.").

order data:
${JSON.stringify(toolResults)}
`.trim();

        const stage2 = streamText({
          model: groqModelInfo.model,
          system: narrationSystem,
          messages, // Plain text messages only
          temperature: 0.4,
          maxTokens: 300,
        });

        stage2.mergeIntoDataStream(dataStream);
      } catch (err) {
        console.warn("[AI Routing] Gemini 2-stage flow failed, falling back", err);
        
        // Fallback for non-Gemini models that safely support native multi-step
        let success = false;
        for (const { provider, model, isGemini } of fallbackModels) {
          if (isGemini) continue; 
          try {
            const fallbackStream = streamText({
              model,
              system: systemPrompt,
              messages,
              temperature: 0.5,
              maxTokens: 4000,
              tools: orderTools,
              maxSteps: 3, 
            });
            fallbackStream.mergeIntoDataStream(dataStream);
            success = true;
            break;
          } catch (e) {
            console.warn(`[AI Routing] ${provider} fallback failed`, e);
          }
        }
        
        if (!success) {
          console.error("[AI Routing] All fallback models failed completely.");
        }
      }
    },
    onError: (error) => (error instanceof Error ? error.message : String(error)),
  });
}

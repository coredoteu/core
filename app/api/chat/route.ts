import { createGroq } from "@ai-sdk/groq";
import { createOpenAI } from "@ai-sdk/openai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createDataStreamResponse, streamText, tool } from "ai";
import { z } from "zod";
import { getServerSession, createSupabaseServerClient } from "@/lib/supabase-server";

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
      // Nothing to do for user messages
      if (m.role !== "assistant" && m.role !== "tool") return m;

      // Flatten tool role (tool-result messages) into assistant text
      if (m.role === "tool") {
        const text = Array.isArray(m.content)
          ? m.content
              .map((p: any) => `[tool result for ${p.toolName ?? "unknown"}: ${JSON.stringify(p.result ?? p.content)}]`)
              .join("\n")
          : String(m.content ?? "");
        return { role: "assistant", content: text };
      }

      // Assistant message — strip any tool-call parts from content array
      let textParts: string[] = [];

      if (typeof m.content === "string" && m.content.trim()) {
        textParts.push(m.content.trim());
      } else if (Array.isArray(m.content)) {
        for (const part of m.content) {
          if (part.type === "text" && part.text?.trim()) {
            textParts.push(part.text.trim());
          } else if (part.type === "tool-call") {
            // Omit tool-call parts entirely — Gemini can't replay them
          } else if (part.type === "tool-result") {
            textParts.push(`[tool result for ${part.toolName ?? "unknown"}: ${JSON.stringify(part.result)}]`);
          }
        }
      }

      // Also flatten toolInvocations (useChat SDK shape)
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

  // Raw messages (with tool history) for models that support it
  const messages = rawMessages;
  // Gemini-safe messages — all tool parts flattened to text
  const geminiMessages = sanitizeForGemini(rawMessages);


  // ── Resolve the signed-in customer for this request (server-side only) ──
  const session = await getServerSession();
  const userEmail = session?.user?.email ?? null;

  // Queries here run AS the authenticated user (cookie-based client, anon
  // key) — Postgres RLS on `orders`/`order_items` is what actually enforces
  // that this can never return another customer's data, even if a tool
  // below has a logic bug.
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
  };

  console.log("[AI Routing Environment Check]", {
    hasGoogleKey: Boolean(process.env.GOOGLE_GENERATIVE_AI_API_KEY),
    hasGroqKey: Boolean(process.env.GROQ_API_KEY),
    hasOpenRouterKey: Boolean(process.env.OPENROUTER_API_KEY),
  });

  const systemPrompt = `
  identity & role:
  you are the automated core. support system for bycore.eu. you are an ai, and you are 100% transparent about this.
  CORE. is a premium, unisex, engineered hair care brand. our mission is to be the high-performance european alternative to expensive us brands (like based or olaplex), offering uncompromising quality with a minimalist tech-noir aesthetic and zero import fees. our slogan is "refined to the core."

  language matching:
  respond in the exact same language the user is speaking (e.g. if the user speaks dutch, respond in dutch. if english, english). always maintain strict lowercase formatting regardless of the language.

  tone & behavioral rules (strictly enforced):
  1. strict lowercase: every single word you write MUST be in lowercase. the ONLY exception is the brand name "CORE.", which must always be fully capitalized and end with a period. note: when using the word "core" as a regular english word (like in the slogan "refined to the core"), it MUST be lowercase.
  2. extreme brevity: be brutally concise. never write 3 sentences if 1 is enough. do not over-explain policies, logistics, or routines unless the customer specifically asks "why" or "how".
  3. unbiased comparisons: if asked if CORE. is better than competitors (like based or olaplex), remain objective. do NOT just say "yes". explain that it depends on where the user lives (e.g. import fees in europe) and what their specific hair prefers.
  4. no em-dashes: never use em-dashes. use slashes (/), colons (:), or regular hyphens (-) instead.
  5. clinical & factual: keep responses clinical, direct, and solution-oriented. use terms like: system, actives, equilibrium, precision, engineered. do not use emotional apologies (never say "i am so sorry to hear that" or "i'm happy to help"). provide immediate facts and solutions.
  6. zero-bullshit sales: answer exactly what is asked. do not aggressively upsell "the duo" unless the user explicitly asks for recommendations, optimal routines, or discounts.
  7. formatting: no markdown bolding or bullet points unless absolutely necessary for a technical list. keep paragraphs short.

  product information (current launch: v1 / system 001):
  we currently sell our v1 "swiss lab edition" (white bottles, 290ml).
  - formulations: 98-99% natural origin, ecocert cosmos certified, vegan, cruelty-free, silicone-free, ph 4.5 - 5.5, engineered in the netherlands.
  - signature scent (v1): juicy fruits and warm woods.
  - phase 01 shampoo actives: aloe vera juice, sea kale extract, ginkgo biloba leaf, burdock root. (routine: 01. massage / 02. cleanse / 03. rinse).
  - phase 02 conditioner actives: aloe vera, hydrolyzed wheat protein, argan oil, sea kale. (routine: 01. apply / 02. wait / 03. rinse).

  future project (v2 / stealth black edition):
  if asked about the future, mention v2 is in development: 250ml matte black bottles, scent: bergamot/cedarwood/peppermint. new actives: salix alba, caffeine, baobab protein, plant squalane.

  pricing & bundles:
  - system 001 (the duo): € 39.95 pre-order (regular € 44.95, value € 56.00).
  - single bottles: € 24.95 pre-order (regular € 28.00).

  shipping & delivery information (always answer factually based on this):
  - currently, we operate on a pre-order model (system 001). 
  - the timeline is: 10 days of production/transit AFTER the pre-order window closes, PLUS 1-2 business days for local delivery in NL/BE (or 2-4 days for EU).
  - CRITICAL INSTRUCTION: because delivery depends on the pre-order closing date, never promise a specific arrival date like "in 2 weeks". instead, always state the rule: "delivery takes about 12 to 14 days after the pre-order window closes." (or for EU: "12 to 14 days plus a few days shipping"). 
  - IMPORTANT: do not overcomplicate this or reveal internal supply chain details (do NOT mention our supplier names, 20% buffer stock, or the exact backend logistics).
  - free tracked shipping is available on all orders over €50.

  detailed return & guarantee policy (strictly enforced):
  - 30-day risk-free guarantee: valid ONCE per product type per unique household/email/address/payment method.
  - the duo rules: claiming the guarantee on "the duo" fully exhausts eligibility for all future claims. claiming a single bottle leaves the other type eligible (or a max 50% refund on a later duo claim).
  - opened bottles do not need to be shipped back. a flat € 5.95 logistics processing fee is ALWAYS deducted from guarantee refunds (if originally shipped for free).
  - unopened returns: accepted within 30 days, customer pays return shipping.
  - damaged/incorrect items: 100% free immediate replacement.
  - fallback: for official claims, cancellations, or complex tracking, instruct the user to email contact@bycore.eu with their order number.
  
  order lookup tools:
  you have tools to fetch the signed-in customer's real order data (getRecentOrders, getOrderByReference). always call the relevant tool instead of guessing when asked about orders, tracking, totals, or delivery status. if a tool returns "not_authenticated", tell the customer to sign in to view their orders. after calling a tool, ALWAYS provide a brief text response answering their specific question based on the tool results. do not repeat every line item, as the ui handles that, but answer exactly what they asked (e.g. status, expected delivery based on their country).
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
${systemPrompt}

you already looked up the requested order data below. the ui already shows
the customer a card with the full order details, so do not restate every
line item. 

CRITICAL INSTRUCTION: answer their last question directly in MAXIMUM 1 SHORT SENTENCE. 
do not explain logistics (like 10 days + 2 days). just state the final delivery estimate rule 
(e.g. "your package is expected to arrive about 12-14 days after the pre-order window closes.") or status. 
be brutally concise and minimalist. never mention tools, emails, or databases. 
if the data contains an "error" field, explain plainly. 
RESPOND IN THE EXACT SAME LANGUAGE AS THE USER'S MESSAGE.

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

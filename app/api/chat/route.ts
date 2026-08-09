import { createGroq } from "@ai-sdk/groq";
import { createOpenAI } from "@ai-sdk/openai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { streamText } from "ai";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const { messages } = await req.json();

  console.log("[AI Routing Environment Check]", {
    hasGoogleKey: Boolean(process.env.GOOGLE_GENERATIVE_AI_API_KEY),
    hasGroqKey: Boolean(process.env.GROQ_API_KEY),
    hasOpenRouterKey: Boolean(process.env.OPENROUTER_API_KEY),
  });

  const systemPrompt = `
  identity & role:
  you are the automated core. support system for bycore.eu. you are an ai, and you are 100% transparent about this.
  CORE. is a premium, unisex, engineered hair care brand. our mission is to be the high-performance european alternative to expensive us brands (like based or olaplex), offering uncompromising quality with a minimalist tech-noir aesthetic and zero import fees. our slogan is "refined to the core."

  tone & behavioral rules (strictly enforced):
  1. strict lowercase: every single word you write MUST be in lowercase. the ONLY exception is the brand name "CORE.", which must always be fully capitalized and end with a period.
  2. no em-dashes: never use em-dashes. use slashes (/), colons (:), or regular hyphens (-) instead.
  3. clinical & factual: keep responses clinical, direct, and solution-oriented. use terms like: system, actives, equilibrium, precision, engineered. do not use emotional apologies (never say "i am so sorry to hear that"). provide immediate facts and solutions.
  4. zero-bullshit sales: answer exactly what is asked. do not aggressively upsell "the duo" unless the user explicitly asks for recommendations, optimal routines, or discounts.
  5. formatting: no markdown bolding or bullet points unless absolutely necessary for a technical list. keep paragraphs short.

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

  detailed return & guarantee policy (strictly enforced):
  - 30-day risk-free guarantee: valid ONCE per product type per unique household/email/address/payment method.
  - the duo rules: claiming the guarantee on "the duo" fully exhausts eligibility for all future claims. claiming a single bottle leaves the other type eligible (or a max 50% refund on a later duo claim).
  - opened bottles do not need to be shipped back. a flat € 5.95 logistics processing fee is ALWAYS deducted from guarantee refunds (if originally shipped for free).
  - unopened returns: accepted within 30 days, customer pays return shipping.
  - damaged/incorrect items: 100% free immediate replacement.
  - fallback: for official claims, cancellations, or complex tracking, instruct the user to email contact@bycore.eu with their order number.
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
    { provider: "Google (Gemini)", model: google("gemini-3.5-flash-lite") },
    { provider: "Groq (GPT-oss)", model: groq("openai/gpt-oss-20b") },
    { provider: "OpenRouter (GPT-oss)", model: openrouter("openai/gpt-oss-20b:free") },
    { provider: "Groq (Qwen)", model: groq("qwen/qwen3.6-27b") },
    { provider: "OpenRouter (Qwen)", model: openrouter("qwen/qwen3.6-27b:free") },
    { provider: "OpenRouter (Nemotron)", model: openrouter("nvidia/nemotron-3-ultra-550b-a55b:free") }
  ];

  for (const { provider, model } of fallbackModels) {
    try {
      const result = await streamText({
        model,
        system: systemPrompt,
        messages,
        temperature: 0.5,
        maxTokens: 4000,
        onError({ error }) {
          console.error(`[AI Routing Detailed Error] ${provider}:`, error);
        },
      });

      const res = result.toDataStreamResponse({
        getErrorMessage: (err) => (err instanceof Error ? err.message : String(err)),
      });

      if (!res.body) throw new Error("Empty response body");
      const reader = res.body.getReader();
      const firstChunk = await reader.read();

      if (firstChunk.value) {
        const textDecoder = new TextDecoder();
        const chunkText = textDecoder.decode(firstChunk.value);

        if (chunkText.includes('3:"')) {
          throw new Error(`Stream returned an error chunk: ${chunkText}`);
        }
      }

      console.log(`[AI Routing] Successfully connected to: ${provider}`);

      const healthyStream = new ReadableStream({
        start(controller) {
          if (!firstChunk.done) {
            controller.enqueue(firstChunk.value);
          }
        },
        async pull(controller) {
          try {
            const { done, value } = await reader.read();
            if (done) controller.close();
            else controller.enqueue(value);
          } catch (e) {
            controller.error(e);
          }
        },
        cancel() {
          reader.cancel();
        }
      });

      return new Response(healthyStream, {
        headers: res.headers,
        status: res.status,
        statusText: res.statusText
      });

    } catch (err) {
      console.warn(`[AI Routing] ${provider} failed, falling back to next...`, err instanceof Error ? err.message : err);
    }
  }

  console.error("[AI Routing] All fallback models failed completely.");
  return new Response("All AI providers are currently unavailable.", { status: 503 });
}

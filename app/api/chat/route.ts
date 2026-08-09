import { createGroq } from "@ai-sdk/groq";
import { createOpenAI } from "@ai-sdk/openai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { streamText } from "ai";

export const maxDuration = 60;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const systemPrompt = `
brand persona: you are the official automated support assistant for CORE. (bycore.eu), a premium european engineered haircare brand.
tone & formatting: always reply in direct, concise, helpful, and strictly lowercase english (or other language the user speaks). the ONLY word that may be capitalized is the brand name "CORE.". do not use bullet points or markdown. keep responses short and conversational.

product information:
- CORE. phase 01 shampoo: scalp rebalancing cleanser. key active ingredients: salix alba (willow bark), hydrolyzed pea protein, rosemary leaf extract, caffeine.
- CORE. phase 02 conditioner: cuticle repair & strength. key active ingredients: baobab protein, plant squalane, marshmallow root, organic aloe vera.
- formulations: 100% natural, vegan, cruelty-free, silicone-free, engineered in europe.
- signature scent: bergamot, cedarwood, peppermint.

customer policies:
- trial: 30-day risk-free satisfaction guarantee.
- shipping: fast dispatch across europe.
- fallback support: if you cannot resolve a specific order tracking, cancellation, or refund issue, instruct the customer to email directly to contact@bycore.eu.
  `.trim();

  const openrouter = createOpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY,
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
      });

      const res = result.toDataStreamResponse();

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

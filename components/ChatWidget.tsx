"use client";

import { useState, useRef, useEffect } from "react";
import { useChat } from "@ai-sdk/react";

function stripThinking(raw: string): string | null {
  if (!raw.includes("<think>")) return raw.trim();
  if (raw.includes("</think>")) {
    return raw.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();
  }
  return null;
}

function AssistantText({ text }: { text: string }) {
  const parts = text.split(/\b(core\.)/i);
  return (
    <span className="whitespace-pre-wrap leading-relaxed">
      {parts.map((part, i) =>
        part.toLowerCase() === "core." ? (
          <span key={i} className="font-semibold">CORE.</span>
        ) : (
          <span key={i} className="lowercase">{part}</span>
        )
      )}
    </span>
  );
}

function ThinkingDots() {
  return (
    <span className="inline-flex items-center gap-[3px]">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-[3px] h-[3px] rounded-full bg-white/30"
          style={{ animation: `pulse 1.2s ease-in-out ${i * 0.4}s infinite` }}
        />
      ))}
    </span>
  );
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    error,
    isLoading,
  } = useChat({ onError: (e) => console.error("Chat error:", e) });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const awaitingFirstToken =
    isLoading && messages[messages.length - 1]?.role === "user";

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans">
      {isOpen && (
        <div className="mb-4 flex flex-col w-[360px] h-[520px] max-w-[calc(100vw-2rem)] bg-[#0D0D0D] border border-white/10 rounded-md shadow-2xl overflow-hidden">
          <div className="flex justify-between items-center px-4 py-3 border-b border-white/10 shrink-0">
            <span className="font-mono text-[11px] text-white/50 tracking-widest select-none">
              [ <span className="text-white font-semibold">CORE.</span> support ai ]
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="font-mono text-[11px] text-white/35 hover:text-white/80 transition-colors"
              aria-label="Close chat"
            >
              [ x ]
            </button>
          </div>

          <div
            className="flex-1 overflow-y-auto p-4 space-y-4"
            style={{ scrollbarWidth: "none" }}
          >
            {messages.length === 0 && !isLoading && (
              <div className="flex items-center justify-center h-full text-white/25 text-xs font-mono select-none">
                how can we help you?
              </div>
            )}

            {messages.map((m, idx) => {
              const isLastMessage = idx === messages.length - 1;

              if (m.role === "user") {
                return (
                  <div key={m.id} className="flex justify-end">
                    <div className="max-w-[82%] px-3 py-2 text-[13px] rounded-md bg-white/5 border border-white/10 text-white/85 lowercase whitespace-pre-wrap leading-relaxed">
                      {m.content}
                    </div>
                  </div>
                );
              }

              const cleaned = stripThinking(m.content ?? "");
              const showDots =
                (cleaned === null || cleaned === "") &&
                isLastMessage &&
                isLoading;

              return (
                <div key={m.id} className="flex justify-start">
                  <div className="max-w-[90%] text-[13px] text-white/80 py-1 min-h-[24px] flex items-center">
                    {showDots ? (
                      <ThinkingDots />
                    ) : cleaned ? (
                      <AssistantText text={cleaned} />
                    ) : (
                      <span className="text-white/25 text-xs font-mono">—</span>
                    )}
                  </div>
                </div>
              );
            })}

            {awaitingFirstToken && (
              <div className="flex justify-start">
                <div className="text-[13px] py-1 min-h-[24px] flex items-center">
                  <ThinkingDots />
                </div>
              </div>
            )}

            {error && (
              <div className="p-3 text-red-400/80 text-xs font-mono lowercase border border-red-500/20 bg-red-500/5 rounded-md">
                error: {error.message || "failed to connect."}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="px-3 py-3 border-t border-white/10 shrink-0">
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
              <input
                className="flex-1 bg-transparent border-none outline-none text-[13px] text-white/90 placeholder-white/25 p-1"
                value={input}
                placeholder="ask a question..."
                onChange={handleInputChange}
                autoComplete="off"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="font-mono text-[11px] text-white/45 hover:text-white/80 disabled:opacity-20 transition-colors select-none shrink-0"
              >
                [ send ]
              </button>
            </form>
          </div>
        </div>
      )}

      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-4 py-3 bg-[#0D0D0D]/90 backdrop-blur-md border border-white/10 hover:border-white/30 transition-all duration-200 rounded-full shadow-lg text-white"
          aria-label="Open support chat"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="opacity-65"
          >
            <path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h12a2 2 0 0 1 2 2z" />
            <path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-2" />
          </svg>
          <span className="font-mono text-[11px] text-white/55">
            [ support ]
          </span>
        </button>
      )}
    </div>
  );
}

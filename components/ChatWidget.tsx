"use client";

import { useState, useRef, useEffect } from "react";
import { useChat } from "@ai-sdk/react";
import { Icon } from "@/components/ui/Icon";
import Image from "next/image";

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
          <strong key={i} className="font-semibold text-white tracking-wide">CORE.</strong>
        ) : (
          <span key={i} className="lowercase">{part}</span>
        )
      )}
    </span>
  );
}

function ThinkingDots() {
  return (
    <span className="inline-flex items-center gap-1.5 px-1 py-1">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-white/40"
          style={{ animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite` }}
        />
      ))}
    </span>
  );
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasStickyCart, setHasStickyCart] = useState(false);

  useEffect(() => {
    const handleStickyChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ visible: boolean }>;
      setHasStickyCart(customEvent.detail.visible);
    };
    window.addEventListener("mobileStickyCartChange", handleStickyChange);
    return () => {
      window.removeEventListener("mobileStickyCartChange", handleStickyChange);
    };
  }, []);

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
    <div
      className={`fixed right-4 md:right-6 z-50 flex flex-col items-end font-sans transition-all duration-300 ${
        hasStickyCart ? "bottom-[84px] md:bottom-6" : "bottom-4 md:bottom-6"
      }`}
    >
      {isOpen && (
        <div 
          className="mb-5 flex flex-col w-[380px] h-[600px] max-w-[calc(100vw-2rem)] max-h-[calc(100vh-120px)] bg-[#0D0D0D]/75 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.8),0_0_80px_rgba(255,255,255,0.03)] overflow-hidden transition-all duration-300 animate-in fade-in slide-in-from-bottom-4"
        >
          {/* Header */}
          <div className="flex justify-between items-center px-5 py-4 shrink-0 relative">
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <div className="flex items-center gap-2 select-none">
              <Image src="/CORE_logo_trans.svg" alt="CORE." width={54} height={13} className="h-[13px] w-auto opacity-90" />
              <span className="font-mono text-[10px] text-white/40 tracking-[0.2em] mt-0.5">
                support
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/40 hover:text-white/90 hover:bg-white/10 transition-all rounded-full p-1.5"
              aria-label="Close chat"
            >
              <Icon src="/icons/x.svg" size={16} />
            </button>
          </div>

          {/* Messages Area */}
          <div
            className="flex-1 overflow-y-auto p-5 space-y-6"
            style={{ scrollbarWidth: "none" }}
          >
            {messages.length === 0 && !isLoading && (
              <div className="flex flex-col items-center justify-center h-full text-white/30 space-y-4 select-none">
                <Icon src="/icons/message-circle-question-mark.svg" size={36} opacity={0.3} />
                <span className="text-[13px] lowercase tracking-wide font-mono opacity-80">how can we help you?</span>
              </div>
            )}

            {messages.map((m, idx) => {
              const isLastMessage = idx === messages.length - 1;

              if (m.role === "user") {
                return (
                  <div key={m.id} className="flex justify-end">
                    <div className="max-w-[85%] px-4 py-2.5 text-[14px] rounded-2xl rounded-tr-sm bg-white/10 text-white/90 lowercase whitespace-pre-wrap leading-relaxed shadow-sm">
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
                  <div className="max-w-[90%] text-[14px] text-white/70 py-1 min-h-[24px] flex items-center">
                    {showDots ? (
                      <ThinkingDots />
                    ) : cleaned ? (
                      <AssistantText text={cleaned} />
                    ) : (
                      <span className="text-white/20 text-sm">—</span>
                    )}
                  </div>
                </div>
              );
            })}

            {awaitingFirstToken && (
              <div className="flex justify-start">
                <div className="py-2 flex items-center">
                  <ThinkingDots />
                </div>
              </div>
            )}

            {error && (
              <div className="p-4 text-red-400/90 text-[13px] lowercase border border-red-500/20 bg-red-500/10 rounded-xl flex items-center gap-3">
                <Icon src="/icons/circle-alert.svg" size={16} />
                <span>{error.message || "failed to connect."}</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="px-4 py-4 shrink-0 bg-gradient-to-t from-[#0D0D0D] to-transparent">
            <form onSubmit={handleSubmit} className="relative flex items-center">
              <input
                className="w-full bg-white/5 hover:bg-white/[0.08] focus:bg-white/10 transition-all border border-white/10 focus:border-white/25 outline-none rounded-full text-[14px] text-white placeholder-white/30 pl-5 pr-12 py-3 shadow-inner"
                value={input}
                placeholder="ask a question..."
                onChange={handleInputChange}
                autoComplete="off"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="absolute right-1.5 p-2 rounded-full text-white/50 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-white/50 transition-all"
                aria-label="Send message"
              >
                <Icon src="/icons/arrow-up.svg" size={18} />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-3 px-5 py-3.5 bg-[#0D0D0D]/70 backdrop-blur-xl border border-white/10 hover:border-white/25 hover:bg-[#1A1A1A]/80 transition-all duration-300 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.6)] text-white hover:scale-[1.02] active:scale-[0.98]"
          aria-label="Open support chat"
        >
          <div className="relative flex items-center justify-center">
            <Icon
              src="/icons/message-circle-question-mark.svg"
              size={18}
              opacity={0.8}
            />
            <div className="absolute inset-0 bg-white/20 blur-md rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <span className="font-mono text-[11px] tracking-[0.15em] text-white/70 group-hover:text-white transition-colors mt-[1px]">
            support
          </span>
        </button>
      )}
    </div>
  );
}

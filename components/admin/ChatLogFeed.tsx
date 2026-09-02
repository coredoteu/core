"use client";

import { useState } from "react";
import type { ChatLogRow } from "@/lib/chat-logs";

export default function ChatLogFeed({ logs }: { logs: ChatLogRow[] }) {
  const [expanded, setExpanded] = useState<string | null>(null);

  if (logs.length === 0) {
    return (
      <div className="border border-hairline p-8 text-center">
        <p className="font-mono text-xs text-white/40 lowercase">
          no chat interactions logged yet.
        </p>
      </div>
    );
  }

  return (
    <div className="border border-hairline divide-y divide-white/[0.06]">
      {logs.map((log) => {
        const isOpen = expanded === log.id;
        return (
          <div key={log.id} className="px-5 py-4">
            <button
              onClick={() => setExpanded(isOpen ? null : log.id)}
              className="w-full flex items-start justify-between gap-4 text-left"
            >
              <div className="flex flex-col gap-1 min-w-0">
                <span className="font-mono text-[9px] tracking-[0.15em] text-white/30 lowercase">
                  {new Date(log.created_at).toLocaleString("en-GB", {
                    day: "numeric",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}{" "}
                  {log.user_email ? `/ ${log.user_email}` : "/ anonymous"}
                </span>
                <span className="text-xs text-white/80 lowercase truncate">
                  {log.user_message || "—"}
                </span>
              </div>
              <span className="shrink-0 font-mono text-[10px] text-white/30">
                {isOpen ? "−" : "+"}
              </span>
            </button>

            {isOpen && (
              <div className="mt-3 pl-3 border-l border-hairline flex flex-col gap-2">
                <p className="text-xs text-white/50 lowercase leading-relaxed">
                  {log.assistant_reply || "—"}
                </p>
                {log.tool_names && log.tool_names.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {log.tool_names.map((t) => (
                      <span
                        key={t}
                        className="font-mono text-[9px] text-white/30 border border-hairline px-2 py-0.5 lowercase"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

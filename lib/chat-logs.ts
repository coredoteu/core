import { supabaseAdmin } from "@/lib/supabase";

export interface ChatLogRow {
  id: string;
  created_at: string;
  user_email: string | null;
  user_message: string;
  assistant_reply: string;
  tool_names: string[] | null;
}

/** Fire-and-forget logger — never throws into the chat request path. */
export async function logChatInteraction({
  userEmail,
  userMessage,
  assistantReply,
  toolNames,
}: {
  userEmail: string | null;
  userMessage: string;
  assistantReply: string;
  toolNames?: string[];
}) {
  try {
    if (!userMessage?.trim() && !assistantReply?.trim()) return;
    await supabaseAdmin.from("chat_logs").insert({
      user_email: userEmail,
      user_message: (userMessage ?? "").slice(0, 2000),
      assistant_reply: (assistantReply ?? "").slice(0, 2000),
      tool_names: toolNames && toolNames.length > 0 ? toolNames : null,
    });
  } catch (err) {
    console.error("[ChatLogs] insert failed:", err);
  }
}

export async function getRecentChatLogs(limit = 50): Promise<ChatLogRow[]> {
  const { data, error } = await supabaseAdmin
    .from("chat_logs")
    .select("id, created_at, user_email, user_message, assistant_reply, tool_names")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("[ChatLogs] fetch failed:", error);
    return [];
  }
  return data ?? [];
}

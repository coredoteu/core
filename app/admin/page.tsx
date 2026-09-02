import { notFound } from "next/navigation";
import { getAdminSession } from "@/lib/admin-auth";
import { getActiveBatch } from "@/lib/batches";
import { getFinancialSummary, getRecentOrdersAdmin } from "@/lib/admin-data";
import { getRecentChatLogs } from "@/lib/chat-logs";
import AdminDashboard from "@/components/admin/AdminDashboard";

export default async function AdminPage() {
  const session = await getAdminSession();
  if (!session) {
    notFound();
  }

  const [batch, financials, orders, chatLogs] = await Promise.all([
    getActiveBatch(),
    getFinancialSummary(),
    getRecentOrdersAdmin(100),
    getRecentChatLogs(50),
  ]);

  return (
    <AdminDashboard
      batch={batch}
      financials={financials}
      orders={orders}
      chatLogs={chatLogs}
    />
  );
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAdminSession } from "@/lib/admin-auth";
import AdminNav from "@/components/admin/AdminNav";

export const metadata: Metadata = {
  title: "system / admin",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();
  if (!session) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white font-sans">
      <AdminNav email={session.user.email ?? ""} />
      <div className="max-w-[1600px] mx-auto px-6 md:px-10 pt-24 pb-24">
        {children}
      </div>
    </div>
  );
}

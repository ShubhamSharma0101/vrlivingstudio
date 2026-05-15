import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth";

import { AdminLayoutShell } from "@/features/admin/components/admin-layout-shell";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/");
  }

  if (user.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <AdminLayoutShell>
      {children}
    </AdminLayoutShell>
  );
}
import { AdminSidebar } from "@/features/admin/components/admin-sidebar";

import { AdminTopbar } from "@/features/admin/components/admin-topbar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#faf8f5]">
      <AdminSidebar />

      <div className="flex flex-1 flex-col">
        <AdminTopbar />

        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
import { AdminSidebar } from "@/features/admin/components/admin-sidebar";
import { AdminTopbar } from "@/features/admin/components/admin-topbar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-[#faf8f5]">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Content */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <AdminTopbar />

        <main className="min-w-0 flex-1 overflow-y-auto overflow-x-hidden p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
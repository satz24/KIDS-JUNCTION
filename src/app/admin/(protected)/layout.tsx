"use client";

import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminAuthGuard } from "@/components/admin/admin-auth-guard";

export default function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthGuard>
      <div className="flex min-h-screen theme-surface section-bg-blue">
        <AdminSidebar />
        <main className="flex-1 p-6 md:p-8 overflow-auto">{children}</main>
      </div>
    </AdminAuthGuard>
  );
}

"use client";

import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminAuthGuard } from "@/components/admin/admin-auth-guard";
import { usePathname } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLogin = pathname === "/admin/login";

  if (isLogin) {
    return <>{children}</>;
  }

  return (
    <AdminAuthGuard>
      <div className="flex min-h-screen theme-surface section-bg-blue">
        <AdminSidebar />
        <main className="flex-1 p-6 md:p-8 overflow-auto">{children}</main>
      </div>
    </AdminAuthGuard>
  );
}

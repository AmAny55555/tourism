"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { useLanguage } from "@/context/language-context";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopbar from "@/components/admin/AdminTopbar";
import PageLoader from "@/components/shared/PageLoader";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const { lang } = useLanguage();
  const router = useRouter();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isAdmin = user?.role?.trim().toLowerCase() === "admin";
  const isAr = lang === "ar";

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace("/auth/login");
      return;
    }

    if (!isAdmin) {
      router.replace("/");
    }
  }, [user, loading, isAdmin, router]);

  if (loading || !user || !isAdmin) {
    return <PageLoader />;
  }

  return (
    <div
      dir={isAr ? "rtl" : "ltr"}
      className="min-h-screen bg-[#fbf7ef]"
    >
      <AdminSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="min-h-screen lg:mr-[280px]">
        <AdminTopbar onMenuClick={() => setSidebarOpen(true)} />

        <main className="w-full p-3 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
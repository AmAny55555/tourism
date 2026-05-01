"use client";

import Link from "next/link";
import Image from "next/image";
import { LogOut, User, BarChart3 } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { useLanguage } from "@/context/language-context";

export default function AdminNavbar() {
  const { logout } = useAuth();
  const { t } = useLanguage();

  const sidebar = t.admin.sidebar;
  const topbar = t.admin.topbar;

  return (
    <header className="fixed left-0 top-0 z-50 w-full border-b border-[#ead7ad] bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex min-h-[76px] max-w-[1280px] items-center justify-between gap-3 px-3 py-3 sm:px-4">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <div className="h-11 w-11 shrink-0 overflow-hidden rounded-full ring-1 ring-[#ead7ad] sm:h-12 sm:w-12">
            <Image src="/1.png" alt="TAUI logo" width={56} height={56} />
          </div>

          <span className="truncate text-base font-black text-[#06142b] sm:text-xl">
            {sidebar.title}
          </span>
        </Link>

        <div className="flex min-w-0 items-center justify-end gap-2 overflow-x-auto whitespace-nowrap pb-1">
          <Link
            href="/admin"
            className="rounded-full bg-[#c99b2e] px-4 py-2 text-sm font-bold text-white sm:px-5"
          >
            {sidebar.tripRequests}
          </Link>

          <Link
            href="/admin/payments"
            className="rounded-full border border-[#ead7ad] px-4 py-2 text-sm font-bold text-[#06142b] transition hover:bg-[#f5ead2] sm:px-5"
          >
            {sidebar.payments}
          </Link>

          <Link
            href="/admin/analytics"
            className="flex items-center gap-2 rounded-full border border-[#ead7ad] px-4 py-2 text-sm font-bold text-[#06142b] transition hover:bg-[#f5ead2] sm:px-5"
          >
            <BarChart3 size={16} className="shrink-0 text-[#c99b2e]" />
            {sidebar.analytics}
          </Link>

          <Link
            href="/dashboard"
            className="flex items-center gap-2 rounded-full border border-[#ead7ad] px-4 py-2 text-sm font-bold text-[#06142b] transition hover:bg-[#f5ead2] sm:px-5"
          >
            <User size={16} className="shrink-0" />
            {sidebar.myAccount}
          </Link>

          <button
            type="button"
            onClick={logout}
            aria-label={topbar.logout}
            className="flex items-center gap-2 rounded-full bg-black px-4 py-2 text-sm font-bold text-[#c99b2e] transition hover:opacity-90 sm:px-5"
          >
            <LogOut size={16} className="shrink-0" />
            <span>{topbar.logout}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
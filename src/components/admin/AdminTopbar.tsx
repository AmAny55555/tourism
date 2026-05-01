"use client";

import { LogOut, Menu, User } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/context/language-context";

export default function AdminTopbar({
  onMenuClick,
}: {
  onMenuClick: () => void;
}) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const { t } = useLanguage();

  const topbar = t.admin.topbar;

  let title = topbar.defaultTitle;
  let subtitle = topbar.defaultSubtitle;

  if (pathname === "/admin") {
    title = topbar.tripRequestsTitle;
    subtitle = topbar.tripRequestsSubtitle;
  }

  if (pathname.startsWith("/admin/payments")) {
    title = topbar.paymentsTitle;
    subtitle = topbar.paymentsSubtitle;
  }

  if (pathname.startsWith("/admin/analytics")) {
    title = topbar.analyticsTitle;
    subtitle = topbar.analyticsSubtitle;
  }

  if (pathname.startsWith("/admin/travel-countries")) {
    title = topbar.travelCountriesTitle;
    subtitle = topbar.travelCountriesSubtitle;
  }

  return (
    <header className="sticky top-0 z-30 border-b border-[#ead7ad] bg-[#fbf7ef]/85 backdrop-blur-xl">
      <div className="flex min-h-[72px] items-center justify-between gap-3 px-3 py-3 sm:min-h-[78px] sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            aria-label={topbar.openMenu}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#ead7ad] bg-white text-[#06142b] transition hover:bg-[#fffaf0] lg:hidden"
          >
            <Menu size={21} />
          </button>

          <div className="min-w-0">
            <p className="truncate text-xs font-bold text-[#c99b2e] sm:text-sm">
              {title}
            </p>

            <div className="mt-1 flex min-w-0 items-center gap-2">
              <User size={19} className="shrink-0 text-[#c99b2e]" />

              <h1 className="truncate text-base font-black text-[#06142b] sm:text-2xl">
                {user?.name || topbar.adminFallback}
              </h1>
            </div>

            <p className="mt-1 hidden max-w-[520px] truncate text-xs font-bold text-[#667085] sm:block">
              {subtitle}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={logout}
          aria-label={topbar.logout}
          className="flex h-10 shrink-0 items-center justify-center gap-2 rounded-full bg-[#06142b] px-3 text-xs font-black text-[#f4c542] transition hover:-translate-y-0.5 hover:shadow-lg sm:px-5 sm:text-sm"
        >
          <LogOut size={16} />
          <span className="hidden sm:inline">{topbar.logout}</span>
        </button>
      </div>
    </header>
  );
}
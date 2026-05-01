"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  CreditCard,
  LayoutDashboard,
  User,
  X,
  Globe2,
 MapPin 
} from "lucide-react";
import { useLanguage } from "@/context/language-context";

const links = [
  {
    href: "/admin",
    labelKey: "tripRequests",
    icon: LayoutDashboard,
  },
  {
    href: "/admin/payments",
    labelKey: "payments",
    icon: CreditCard,
  },
  {
    href: "/admin/analytics",
    labelKey: "analytics",
    icon: BarChart3,
  },
  {
    href: "/dashboard",
    labelKey: "myAccount",
    icon: User,
  },
  {
    href: "/admin/travel-countries",
    labelKey: "countriesForms",
    icon: Globe2,
  },


  {
    href: "/admin/destinations",
    labelKey: "destinations",
    icon: MapPin,
  },
] as const;
export default function AdminSidebar({
  open,
  onClose,
}: {
  open?: boolean;
  onClose?: () => void;
}) {
  const pathname = usePathname();
  const { t } = useLanguage();

  const sidebar = t.admin.sidebar;

  return (
    <>
      {open && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`fixed right-0 top-0 z-50 h-screen w-[280px] border-l border-[#ead7ad] bg-white/95 px-4 py-5 shadow-sm backdrop-blur-xl transition-transform duration-300
        ${open ? "translate-x-0" : "translate-x-full lg:translate-x-0"}`}
      >
        <button
          onClick={onClose}
          className="mb-4 flex h-10 w-10 items-center justify-center rounded-full border border-[#ead7ad] bg-[#fffaf0] text-[#06142b] lg:hidden"
          aria-label={sidebar.close}
        >
          <X size={20} />
        </button>

        <Link
          href="/admin"
          onClick={onClose}
          className="mb-8 flex items-center gap-3 rounded-[26px] border border-[#ead7ad] bg-[#fffaf0] p-3"
        >
          <div className="h-12 w-12 overflow-hidden rounded-full ring-1 ring-[#ead7ad]">
            <Image src="/1.png" alt="TAUI logo" width={56} height={56} />
          </div>

          <div>
            <p className="text-lg font-black text-[#06142b]">
              {sidebar.title}
            </p>
            <p className="text-xs font-bold text-[#667085]">
              {sidebar.dashboard}
            </p>
          </div>
        </Link>

        <nav className="space-y-2">
          {links.map((item) => {
            const Icon = item.icon;
            const active =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-black transition ${
                  active
                    ? "bg-[#c99b2e] text-white shadow-lg shadow-[#c99b2e]/20"
                    : "text-[#06142b] hover:bg-[#f5ead2]"
                }`}
              >
                <Icon
                  size={19}
                  className={active ? "text-white" : "text-[#c99b2e]"}
                />
             {sidebar[item.labelKey] || item.labelKey}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-5 left-4 right-4"></div>
      </aside>
    </>
  );
}
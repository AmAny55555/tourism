'use client'
import { useEffect, useState } from "react";
import {
  Home,
  Info,
  Map,
  Plane,
  MessageCircle,
  Moon,
  Sun,
  Languages,
  Menu,
  X,
  LogIn,
  LogOut,
  User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import NotificationBell from "@/components/notifications/NotificationBell";
import { useAuth } from "../../context/auth-context";
import { useLanguage } from "@/context/language-context";

const navItems = [
  { key: "home", icon: Home, href: "/" },
  { key: "about", icon: Info, href: "/about" },
  { key: "tours", icon: Map, href: "/tours" },
  { key: "outboundTrips", icon: Plane, href: "/outbound" },
] as const;

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dark, setDark] = useState(false);

  const { user, loading, logout } = useAuth();
  const { lang, setLang, t } = useLanguage();

  const navbar = t.common.navbar;
  const isEn = lang === "en";

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
      setDark(true);
    } else {
      document.documentElement.classList.remove("dark");
      setDark(false);
    }
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 15);
    onScroll();

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleTheme = () => {
    const newDark = !dark;

    setDark(newDark);

    if (newDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const handleLogout = async () => {
    setOpen(false);
    await logout();
  };

  const toggleLanguage = () => {
    setLang(lang === "ar" ? "en" : "ar");
  };

  return (
    <header
className={`fixed left-0 top-0 z-50 w-full border-b transition-all duration-300 ${
        scrolled
          ? "border-[#ede7dc]/70 bg-white/90 shadow-[0_8px_30px_rgba(0,0,0,0.05)] backdrop-blur-xl dark:border-[#c99b2e]/25 dark:bg-[#080808]/95 dark:shadow-[0_8px_30px_rgba(0,0,0,0.55)]"
          : "border-[#ede7dc]/35 bg-white/75 backdrop-blur-md dark:border-[#c99b2e]/20 dark:bg-[#080808]/90"
      }`}
    >
      <div className="mx-auto flex h-[74px] max-w-[1500px] items-center justify-between gap-3 px-4 sm:px-6 lg:h-[82px]">
        <Link href="/" className="group flex shrink-0 items-center gap-3">
          <div className="flex h-[48px] w-[48px] shrink-0 items-center justify-center overflow-hidden rounded-full ring-1 ring-[#ead7ad] transition group-hover:scale-110 dark:ring-[#c99b2e]/50 lg:h-[54px] lg:w-[54px]">
            <Image
              src="/1.png"
              alt="TAUI logo"
              width={56}
              height={56}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="whitespace-nowrap text-[17px] font-semibold leading-tight text-[#1f1f1f] transition group-hover:text-[#c99b2e] dark:text-white sm:text-[21px] lg:text-[23px]">
            Taui Traveling
          </div>
        </Link>

        <nav className="hidden flex-1 flex-nowrap items-center justify-center gap-1 lg:flex">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex h-[44px] shrink-0 items-center gap-2 whitespace-nowrap rounded-full px-3 text-[14px] font-bold text-[#5f6368] transition hover:bg-[#f3f4f6] hover:text-[#c99b2e] dark:text-[#b8b8b8] dark:hover:bg-[#1b1912] dark:hover:text-[#c99b2e]"
              >
                <Icon size={17} className="shrink-0" />
                <span className="whitespace-nowrap">
                  {navbar.links[item.key]}
                </span>
              </Link>
            );
          })}

          <Link
            href="/contact"
            className="flex h-[44px] shrink-0 items-center gap-2 whitespace-nowrap rounded-full bg-[#c99b2e] px-5 text-[14px] font-bold text-white shadow-sm transition hover:-translate-y-1 hover:bg-[#b88b25] dark:bg-gradient-to-r dark:from-[#d6ad3f] dark:via-[#fff1a8] dark:to-[#c89522] dark:text-black dark:shadow-[0_0_25px_rgba(201,155,46,0.22)]"
          >
            <MessageCircle size={17} className="shrink-0" />
            <span className="whitespace-nowrap">{navbar.contact}</span>
          </Link>
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={toggleLanguage}
            aria-label={navbar.changeLanguage}
            className="hidden h-[42px] w-[42px] shrink-0 items-center justify-center rounded-full border border-[#e7e1d6] bg-white/85 text-[#6b7280] transition hover:text-[#c99b2e] dark:border-[#c99b2e]/35 dark:bg-[#1b1912] dark:text-[#b8b8b8] dark:hover:bg-[#2a2418] dark:hover:text-[#c99b2e] sm:flex lg:h-[44px] lg:w-[44px]"
          >
            <Languages size={17} />
          </button>

          <button
            type="button"
            onClick={toggleTheme}
            aria-label={navbar.toggleTheme}
            className="hidden h-[42px] w-[42px] shrink-0 items-center justify-center rounded-full border border-[#e7e1d6] bg-white/85 text-[#6b7280] transition hover:text-[#c99b2e] dark:border-[#c99b2e]/35 dark:bg-[#1b1912] dark:text-[#c99b2e] dark:hover:bg-[#2a2418] dark:hover:shadow-[0_0_20px_rgba(201,155,46,0.25)] sm:flex lg:h-[44px] lg:w-[44px]"
          >
            {dark ? <Sun size={17} /> : <Moon size={17} />}
          </button>

          {loading && (
            <div className="hidden shrink-0 items-center gap-2 lg:flex">
              <div className="h-[44px] w-[118px] animate-pulse rounded-full bg-[#ead7ad]/50 dark:bg-[#c99b2e]/20" />
              <div className="h-[44px] w-[82px] animate-pulse rounded-full bg-[#ead7ad]/50 dark:bg-[#c99b2e]/20" />
            </div>
          )}

          {!loading && user && <NotificationBell />}

          {!loading && !user && (
            <Link
              href="/auth/login"
              className="hidden h-[44px] shrink-0 items-center gap-2 whitespace-nowrap rounded-full bg-[#c99b2e] px-5 text-[14px] font-bold text-white shadow-sm transition hover:bg-[#b88b25] dark:bg-gradient-to-r dark:from-[#d6ad3f] dark:via-[#fff1a8] dark:to-[#c89522] dark:text-black lg:flex"
            >
              <LogIn size={17} className="shrink-0" />
              <span className="whitespace-nowrap">{navbar.login}</span>
            </Link>
          )}

          {!loading && user && (
            <div className="hidden shrink-0 items-center gap-2 lg:flex">
              <Link
                href={user.role === "admin" ? "/admin" : "/dashboard"}
                className="flex h-[44px] shrink-0 items-center gap-2 whitespace-nowrap rounded-full border border-[#ead7ad] bg-white/85 px-4 text-[14px] font-bold text-[#1f1f1f] transition hover:bg-[#fffaf0] hover:text-[#c99b2e] dark:border-[#c99b2e]/35 dark:bg-[#1b1912] dark:text-white dark:hover:bg-[#2a2418] dark:hover:text-[#c99b2e]"
              >
                <User size={17} className="shrink-0" />
                <span className="whitespace-nowrap">
                  {user.role === "admin" ? navbar.adminPanel : navbar.myAccount}
                </span>
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                aria-label={navbar.logout}
                className="flex h-[44px] shrink-0 items-center gap-2 whitespace-nowrap rounded-full bg-[#1f1f1f] px-4 text-[14px] font-bold text-[#c99b2e] transition hover:bg-[#c99b2e] hover:text-white dark:bg-[#111111] dark:text-[#c99b2e] dark:hover:bg-[#c99b2e] dark:hover:text-black"
              >
                <LogOut size={17} className="shrink-0" />
                <span className="whitespace-nowrap">{navbar.logout}</span>
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={() => setOpen(!open)}
            aria-label={open ? navbar.closeMenu : navbar.openMenu}
            className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-full border border-[#e7e1d6] bg-white/85 text-[#1f1f1f] transition hover:text-[#c99b2e] dark:border-[#c99b2e]/35 dark:bg-[#1b1912] dark:text-[#c99b2e] dark:hover:bg-[#2a2418] lg:hidden"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-[#ede7dc]/60 bg-white/95 px-4 py-4 shadow-lg backdrop-blur-xl dark:border-[#c99b2e]/20 dark:bg-[#080808]/95 lg:hidden">
          <nav className="mx-auto flex max-w-[1280px] flex-col gap-2">
            <button
              type="button"
              onClick={toggleLanguage}
              aria-label={navbar.changeLanguage}
              className="flex h-[48px] items-center justify-center gap-2 rounded-2xl border border-[#ead7ad] bg-white text-[15px] font-bold text-[#5f6368] dark:border-[#c99b2e]/35 dark:bg-[#1b1912] dark:text-[#b8b8b8]"
            >
              <Languages size={18} />
              <span>{isEn ? "العربية" : "English"}</span>
            </button>

            <button
              type="button"
              onClick={toggleTheme}
              aria-label={navbar.toggleTheme}
              className="flex h-[48px] items-center justify-center gap-2 rounded-2xl border border-[#ead7ad] bg-white text-[15px] font-bold text-[#5f6368] dark:border-[#c99b2e]/35 dark:bg-[#1b1912] dark:text-[#c99b2e]"
            >
              {dark ? <Sun size={18} /> : <Moon size={18} />}
              <span>{navbar.toggleTheme}</span>
            </button>

            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex h-[48px] items-center justify-center gap-2 rounded-2xl text-[15px] font-bold text-[#5f6368] transition hover:bg-[#f3f4f6] hover:text-[#c99b2e] dark:text-[#b8b8b8] dark:hover:bg-[#1b1912] dark:hover:text-[#c99b2e]"
                >
                  <Icon size={18} />
                  <span>{navbar.links[item.key]}</span>
                </Link>
              );
            })}

            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="mt-2 flex h-[50px] items-center justify-center gap-2 rounded-2xl bg-[#c99b2e] text-[15px] font-bold text-white dark:bg-gradient-to-r dark:from-[#d6ad3f] dark:via-[#fff1a8] dark:to-[#c89522] dark:text-black"
            >
              <MessageCircle size={18} />
              <span>{navbar.contact}</span>
            </Link>

            {!loading && !user && (
              <Link
                href="/auth/login"
                onClick={() => setOpen(false)}
                className="mt-2 flex h-[50px] items-center justify-center gap-2 rounded-2xl bg-[#c99b2e] text-[15px] font-bold text-white dark:bg-gradient-to-r dark:from-[#d6ad3f] dark:via-[#fff1a8] dark:to-[#c89522] dark:text-black"
              >
                <LogIn size={18} />
                <span>{navbar.login}</span>
              </Link>
            )}

            {!loading && user && (
              <>
                <Link
                  href={user.role === "admin" ? "/admin" : "/dashboard"}
                  onClick={() => setOpen(false)}
                  className="mt-2 flex h-[50px] items-center justify-center gap-2 rounded-2xl border border-[#ead7ad] bg-white text-[15px] font-bold text-[#1f1f1f] dark:border-[#c99b2e]/35 dark:bg-[#1b1912] dark:text-white"
                >
                  <User size={18} />
                  <span>
                    {user.role === "admin"
                      ? navbar.adminPanel
                      : navbar.myAccount}
                  </span>
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex h-[50px] items-center justify-center gap-2 rounded-2xl bg-[#1f1f1f] text-[15px] font-bold text-[#c99b2e] dark:bg-[#111111] dark:text-[#c99b2e]"
                >
                  <LogOut size={18} />
                  <span>{navbar.logout}</span>
                </button>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
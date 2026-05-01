"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpLeft, Mail, MapPin, Send } from "lucide-react";
import { useLanguage } from "@/context/language-context";

export default function Footer() {
  const { lang, t } = useLanguage();
  const footer = t.common.footer;
  const isAr = lang === "ar";

  const socialLinks = [
    {
      label: "f",
      href: "https://www.facebook.com/profile.php?id=61578315581368",
    },
    {
      label: "in",
      href: "https://www.linkedin.com/in/taui-travel-02279237b/",
    },
  ];

  const footerLinks = [
    {
      label: footer.links.home,
      href: "/",
    },
    {
      label: footer.links.tours,
      href: "/tours",
    },
    {
      label: footer.links.externalTours,
      href: "/external-tours",
    },
    {
      label: footer.links.about,
      href: "#about",
    },
    {
      label: footer.links.contact,
      href: "#contact",
    },
    {
      label: footer.links.login,
      href: "/auth/login",
    },
  ];

  return (
    <footer
      dir={isAr ? "rtl" : "ltr"}
      className="relative overflow-hidden bg-[#070707] text-white"
    >
      <div className="mx-auto max-w-[1280px] px-4 py-14 sm:px-6 lg:py-20">
        <div className="mb-14 rounded-[28px] border border-white/10 bg-white/[0.04] p-6 shadow-[0_0_70px_rgba(212,175,55,0.08)] backdrop-blur-xl sm:mb-20 sm:rounded-[36px] sm:p-8 lg:p-14">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-3xl">
              <MapPin className="mb-5 text-[#d4af37] sm:mb-6" size={34} />

              <h2 className="text-2xl font-bold leading-tight text-white sm:text-3xl md:text-5xl">
                {footer.ctaTitle}
              </h2>

              <p className="mt-5 text-sm leading-7 text-white/65 sm:text-base md:text-lg md:leading-8">
                {footer.ctaDescription}
              </p>
            </div>

            <Link
              href="#contact"
              className="inline-flex h-14 w-fit items-center justify-center gap-3 rounded-full bg-[#d4af37] px-7 text-base font-bold text-white shadow-[0_0_45px_rgba(212,175,55,0.35)] transition hover:-translate-y-1 hover:bg-[#bd982c] sm:h-16 sm:px-10 sm:text-lg"
            >
              {footer.contactButton}
              <ArrowUpLeft size={20} />
            </Link>
          </div>
        </div>

        <div className="relative grid gap-12 lg:grid-cols-[1.2fr_0.75fr_1.25fr]">
          <div className="relative z-10">
            <div className="relative mb-8 h-28 w-28 overflow-hidden rounded-full bg-white shadow-[0_0_50px_rgba(212,175,55,0.25)] sm:h-36 sm:w-36">
              <Image
                src="/1.png"
                alt="TAUI logo"
                fill
                className="object-cover"
              />
            </div>

            <p className="max-w-md text-base leading-8 text-white/75 sm:text-lg sm:leading-9">
              {footer.description}
            </p>

            <div className="mt-10 max-w-md">
              <div className="group flex h-14 items-center rounded-full border border-white/10 bg-white/[0.05] p-2 transition-all duration-500 hover:border-[#d4af37]/40 hover:bg-[#d4af37]/15 hover:shadow-[0_0_45px_rgba(212,175,55,0.35)] sm:h-16">
                <button
                  type="button"
                  aria-label={footer.newsletterButton}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#d4af37] text-white shadow-[0_0_22px_rgba(212,175,55,0.45)] transition group-hover:scale-105 sm:h-12 sm:w-12"
                >
                  <Send size={18} />
                </button>

                <input
                  type="email"
                  placeholder={footer.newsletterPlaceholder}
                  className={`h-full flex-1 bg-transparent px-4 text-sm text-white outline-none placeholder:text-white/35 ${
                    isAr ? "text-right" : "text-left"
                  }`}
                />
              </div>
            </div>
          </div>

          <div className="relative z-10">
            <h3 className="text-lg font-bold text-[#d4af37]">
              {footer.exploreTitle}
            </h3>

            <div className="mt-3 h-px w-12 bg-[#d4af37]" />

            <ul className="mt-7 space-y-4 text-white/75">
              {footerLinks.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="transition hover:text-[#d4af37]">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative z-10">
            <h3 className="text-lg font-bold text-[#d4af37]">
              {footer.contactTitle}
            </h3>

            <div className="mt-3 h-px w-12 bg-[#d4af37]" />

            <div className="mt-7 space-y-6">
              <div className="flex items-center gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-[#d4af37]">
                  <Mail size={18} />
                </span>

                <span className="break-all text-white/80">
                  taui.travel@gmail.com
                </span>
              </div>

              <div className="flex items-center gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-[#d4af37]">
                  <MapPin size={18} />
                </span>

                <span className="text-white/80">{footer.location}</span>
              </div>
            </div>

            <div className="mt-10 flex flex-wrap gap-4">
              {socialLinks.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={item.label}
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-white/8 text-sm font-bold uppercase text-white transition hover:bg-[#d4af37] hover:text-black"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="pointer-events-none absolute bottom-[-70px] left-1/2 z-0 -translate-x-1/2 text-[120px] font-bold leading-none text-white/[0.035] sm:text-[220px] lg:text-[300px]">
            TAUI
          </div>
        </div>

        <div className="relative z-10 mt-16 border-t border-white/10 pt-8 sm:mt-20">
          <div className="flex flex-col gap-4 text-sm text-white/45 md:flex-row md:items-center md:justify-between">
            <p>{footer.copyright}</p>

            <div className="flex flex-wrap gap-5 sm:gap-8">
              <Link href="#" className="transition hover:text-[#d4af37]">
                {footer.privacy}
              </Link>

              <Link href="#" className="transition hover:text-[#d4af37]">
                {footer.terms}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
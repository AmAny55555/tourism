"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useLanguage } from "@/context/language-context";

const slides = [
  {
    key: "luxor",
    image:
      "https://images.pexels.com/photos/91409/pexels-photo-91409.jpeg?auto=compress&cs=tinysrgb&w=2000",
  },
  {
    key: "giza",
    image:
      "https://images.pexels.com/photos/262786/pexels-photo-262786.jpeg?auto=compress&cs=tinysrgb&w=2000",
  },
  {
    key: "aswan",
    image:
      "https://images.pexels.com/photos/3889855/pexels-photo-3889855.jpeg?auto=compress&cs=tinysrgb&w=2000",
  },
  {
    key: "sinai",
    image:
      "https://images.pexels.com/photos/1659438/pexels-photo-1659438.jpeg?auto=compress&cs=tinysrgb&w=2000",
  },
] as const;

export default function HeroSection() {
  const [active, setActive] = useState(1);
  const { lang, t } = useLanguage();

  const hero = t.common.heroSection;
  const isAr = lang === "ar";

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % slides.length);
    }, 6000);

    return () => clearInterval(timer);
  }, []);

  const activeSlide = slides[active];
  const activeSlideText = hero.slides[activeSlide.key];

  return (
    <section
      dir={isAr ? "rtl" : "ltr"}
      className="relative flex min-h-[calc(100vh-96px)] items-center justify-center overflow-hidden bg-[#050505] text-white"
    >
      <div className="absolute inset-0">
        {slides.map((slide, index) => {
          const slideText = hero.slides[slide.key];

          return (
            <Image
              key={slide.key}
              src={slide.image}
              alt={slideText.title}
              fill
              priority={index === active}
              sizes="100vw"
              className={`object-cover transition-opacity duration-1000 ${
                index === active ? "hero-bg-animate" : "opacity-0"
              }`}
            />
          );
        })}
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/25 to-black/90" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#f7f0e6]/70 via-transparent to-transparent" />

      <div className="relative z-10 mx-auto flex w-full max-w-[1280px] flex-col items-center px-4 pb-10 pt-8 text-center sm:px-6 lg:pt-10">
        <div className="max-w-5xl space-y-5 sm:space-y-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#d4af37]/40 bg-[#d4af37]/10 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-[#f2d27b] backdrop-blur-md sm:text-xs">
            <span className="h-1.5 w-1.5 rounded-full bg-[#d4af37] shadow-[0_0_14px_rgba(212,175,55,0.9)]" />
            {hero.badge}
          </span>

          <h1 className="mx-auto max-w-5xl text-4xl font-medium leading-[1.15] text-white drop-shadow-2xl sm:text-6xl lg:text-[5.5rem]">
            {hero.titleLineOne}
            <br />
            {hero.titleLineTwo}
          </h1>

          <p className="mx-auto max-w-2xl text-base font-light leading-8 text-[#eadfcd] drop-shadow-md sm:text-lg lg:text-xl">
            {hero.description}
          </p>

          <div className="flex flex-col items-center justify-center gap-4 pt-4 sm:flex-row">
            <Link
              href="/tours"
              className="flex h-13 w-full items-center justify-center gap-2 rounded-full bg-[#d4af37] px-7 text-sm font-bold text-white shadow-[0_18px_50px_rgba(212,175,55,0.35)] transition-all duration-300 hover:-translate-y-1 hover:bg-[#bd982c] sm:h-14 sm:w-auto sm:px-8 sm:text-base"
            >
              {hero.primaryButton}
              <ArrowUpRight size={18} className="shrink-0" />
            </Link>

            <Link
              href="#contact"
              className="flex h-13 w-full items-center justify-center rounded-full border border-white/20 bg-white/10 px-7 text-sm font-semibold text-white backdrop-blur-md transition-all duration-300 hover:border-white/40 hover:bg-white/15 sm:h-14 sm:w-auto sm:px-8 sm:text-base"
            >
              {hero.secondaryButton}
            </Link>
          </div>
        </div>

        <div className="mt-12 w-full max-w-5xl rounded-[24px] border border-white/10 bg-[#4a4a4a]/70 p-3 shadow-2xl backdrop-blur-xl sm:mt-16 sm:rounded-[28px] sm:p-4 md:px-7">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div
              className={`text-center md:flex-1 ${
                isAr ? "md:text-right" : "md:text-left"
              }`}
            >
              <p className="text-xs font-bold tracking-wider text-[#d4af37]">
                {activeSlideText.eyebrow}
              </p>

              <p className="mt-1 text-lg font-medium text-white sm:text-2xl">
                {activeSlideText.title}
              </p>
            </div>

            <div
              className={`flex justify-center gap-2 ${
                isAr ? "md:justify-start" : "md:justify-end"
              }`}
            >
              {slides.map((slide, index) => {
                const slideText = hero.slides[slide.key];

                return (
                  <button
                    key={slide.key}
                    type="button"
                    onClick={() => setActive(index)}
                    aria-label={`${hero.slideLabel} ${index + 1}`}
                    className={`relative h-14 overflow-hidden rounded-2xl transition-all duration-700 sm:h-16 ${
                      active === index
                        ? "w-24 border border-[#d4af37] shadow-[0_0_24px_rgba(212,175,55,0.35)] sm:w-36"
                        : "w-14 opacity-45 hover:opacity-100 sm:w-16"
                    }`}
                  >
                    <Image
                      src={slide.image}
                      alt={slideText.title}
                      fill
                      sizes="160px"
                      className="object-cover"
                    />

                    <div
                      className={`absolute inset-0 transition-colors duration-500 ${
                        active === index ? "bg-black/5" : "bg-black/55"
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Crown, Sparkles, Compass, MapPin } from "lucide-react";
import { useLanguage } from "@/context/language-context";

const tours = [
  {
    key: "royalHeritage",
    icon: Crown,
  },
  {
    key: "luxuryCalm",
    icon: Sparkles,
  },
  {
    key: "organizedAdventure",
    icon: Compass,
  },
  {
    key: "citiesLife",
    icon: MapPin,
  },
] as const;

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.18,
      delayChildren: 0.2,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6 },
  },
};

export default function ToursSection() {
  const { lang, t } = useLanguage();
  const toursSection = t.common.toursSection;
  const isAr = lang === "ar";

  return (
    <section
      dir={isAr ? "rtl" : "ltr"}
      className="relative overflow-hidden bg-[#f7f0e6] py-14 lg:py-20"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#d4af37]/25 to-transparent" />

      <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
          className="mx-auto mb-10 max-w-3xl text-center sm:mb-12"
        >
          <span className="inline-block rounded-full border border-[#d4af37]/30 bg-white/60 px-4 py-2 text-xs font-bold text-[#8f6f2a] shadow-sm backdrop-blur-md">
            {toursSection.badge}
          </span>

          <h2 className="mt-5 text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
            <span className="bg-gradient-to-r from-[#8f6f2a] via-[#d4af37] to-[#f3d77b] bg-clip-text text-transparent">
              {toursSection.title}
            </span>
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
            {toursSection.description}
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="grid gap-5 sm:grid-cols-2 lg:gap-6 xl:grid-cols-4"
        >
          {tours.map((tour) => {
            const Icon = tour.icon;
            const tourText = toursSection.items[tour.key];

            return (
              <motion.article
                key={tour.key}
                variants={item}
                className={`group rounded-[28px] border border-[#ead7ad]/50 bg-white/90 p-6 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(212,175,55,0.2)] sm:p-8 ${
                  isAr ? "text-right" : "text-left"
                }`}
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#d4af37]/15 text-[#9a7421] transition group-hover:scale-105">
                  <Icon size={26} />
                </div>

                <h3 className="mt-6 text-xl font-semibold text-[#101827] sm:text-2xl">
                  {tourText.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-500">
                  {tourText.description}
                </p>

                <Link
                  href="/tours"
                  className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#8f6f2a] transition hover:text-[#c99b2e]"
                >
                  <span aria-hidden="true">{isAr ? "←" : "→"}</span>
                  {toursSection.button}
                </Link>
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
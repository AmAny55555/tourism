"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/language-context";

export default function CTASection() {
  const { lang, t } = useLanguage();
  const cta = t.common.ctaSection;
  const isAr = lang === "ar";

  return (
    <section
      dir={isAr ? "rtl" : "ltr"}
      className="relative overflow-hidden bg-[#f7f0e6] py-14 text-center sm:py-16 lg:py-20"
    >
      <div className="absolute left-1/2 top-1/2 h-[360px] w-[90%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#d4af37]/10 blur-[100px] sm:h-[500px] sm:w-[70%] sm:blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-3xl px-4 sm:px-6">
        <div className="mb-6 flex flex-wrap justify-center gap-3">
          <span className="rounded-full border border-[#d4af37]/30 bg-white px-4 py-2 text-xs font-bold text-[#8f6f2a] shadow-sm">
            {cta.badges.personal}
          </span>

          <span className="rounded-full border border-[#d4af37]/30 bg-white px-4 py-2 text-xs font-bold text-[#8f6f2a] shadow-sm">
            {cta.badges.plan}
          </span>
        </div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
          className="text-3xl font-bold leading-tight text-[#101827] sm:text-4xl md:text-5xl"
        >
          {cta.title}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="mx-auto mt-5 max-w-2xl text-sm leading-8 text-gray-600 sm:mt-6 sm:text-base"
        >
          {cta.description}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ delay: 0.4, duration: 0.7 }}
          className="mt-8 flex flex-col justify-center gap-3 sm:mt-10 sm:flex-row sm:flex-wrap sm:gap-4"
        >
          <Link
            href="/tours"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#d4af37] px-8 py-3 text-base font-bold text-white shadow-[0_16px_40px_rgba(212,175,55,0.3)] transition hover:-translate-y-1 hover:bg-[#bd982c] sm:w-auto"
          >
            {cta.primaryButton}
            <span aria-hidden="true">{isAr ? "←" : "→"}</span>
          </Link>

          <Link
            href="/contact"
            className="inline-flex w-full items-center justify-center rounded-full border border-[#ddd6c8] bg-white/40 px-8 py-3 text-base font-semibold text-[#101827] transition hover:bg-gray-100 sm:w-auto"
          >
            {cta.secondaryButton}
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
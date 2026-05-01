"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, Shield, Headphones } from "lucide-react";
import { useLanguage } from "@/context/language-context";

const steps = [
  {
    key: "chooseDestination",
    icon: Sparkles,
  },
  {
    key: "designTrip",
    icon: Shield,
  },
  {
    key: "confirmEnjoy",
    icon: Headphones,
  },
] as const;

export default function HowItWorksSection() {
  const { lang, t } = useLanguage();
  const howItWorks = t.common.howItWorksSection;
  const isAr = lang === "ar";

  return (
    <section
      dir={isAr ? "rtl" : "ltr"}
      className="relative overflow-hidden bg-[#f7f0e6] py-14 sm:py-16 lg:py-20"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#d4af37]/25 to-transparent" />

      <div className="mx-auto max-w-6xl px-4 text-center sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
          className="mx-auto max-w-3xl"
        >
          <h2 className="text-3xl font-bold leading-tight text-[#8f6f2a] sm:text-4xl md:text-5xl">
            {howItWorks.title}
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-gray-600 sm:text-base">
            {howItWorks.description}
          </p>
        </motion.div>

        <div className="mt-10 grid gap-5 sm:mt-12 md:grid-cols-3 md:gap-6">
          {steps.map((item, index) => {
            const Icon = item.icon;
            const step = howItWorks.steps[item.key];

            return (
              <motion.article
                key={item.key}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ delay: index * 0.15, duration: 0.6 }}
                className="group rounded-3xl border border-[#ead7ad]/60 bg-white/90 p-6 text-center shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_22px_55px_rgba(212,175,55,0.18)] sm:p-7"
              >
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#d4af37]/15 text-[#c99b2e] transition group-hover:scale-105">
                  <Icon size={30} />
                </div>

                <span className="text-sm font-bold text-[#c99b2e]">
                  {step.step}
                </span>

                <h3 className="mt-2 text-xl font-bold text-[#101827]">
                  {step.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-gray-600">
                  {step.description}
                </p>
              </motion.article>
            );
          })}
        </div>

        <div className="mt-10">
          <Link
            href="/tours"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#c99b2e] px-8 py-3 text-sm font-bold text-white shadow-[0_16px_40px_rgba(201,155,46,0.25)] transition hover:-translate-y-1 hover:bg-[#b88b25] sm:text-base"
          >
            {howItWorks.button}
            <span aria-hidden="true">{isAr ? "←" : "→"}</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
"use client";

import { motion } from "framer-motion";
import { Compass, Earth, Headphones, Shield } from "lucide-react";
import { useLanguage } from "@/context/language-context";

const features = [
  {
    key: "flexiblePlanning",
    icon: Compass,
  },
  {
    key: "trustOrganization",
    icon: Shield,
  },
  {
    key: "bilingualExperience",
    icon: Earth,
  },
  {
    key: "directSupport",
    icon: Headphones,
  },
] as const;

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.18,
      delayChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 35,
    scale: 0.96,
  },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

export default function FeaturesSection() {
  const { lang, t } = useLanguage();
  const featuresSection = t.common.featuresSection;
  const isAr = lang === "ar";

  return (
    <section
      dir={isAr ? "rtl" : "ltr"}
      className="relative overflow-hidden bg-[#f7f0e6] py-12 lg:py-20"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#d4af37]/25 to-transparent" />

      <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
          className="mx-auto mb-10 max-w-3xl text-center sm:mb-12"
        >
          <span className="mb-4 inline-flex rounded-full border border-[#d4af37]/25 bg-white/60 px-4 py-2 text-xs font-bold text-[#8f6f2a] shadow-sm backdrop-blur-md">
            {featuresSection.badge}
          </span>

          <h2 className="text-3xl font-bold sm:text-4xl md:text-5xl">
            <span className="bg-gradient-to-r from-[#8f6f2a] via-[#d4af37] to-[#f3d77b] bg-clip-text text-transparent">
              {featuresSection.title}
            </span>
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
            {featuresSection.description}
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="grid gap-5 sm:grid-cols-2 lg:gap-6 xl:grid-cols-4"
        >
          {features.map((feature) => {
            const Icon = feature.icon;
            const featureText = featuresSection.items[feature.key];

            return (
              <motion.article
                key={feature.key}
                variants={cardVariants}
                className={`group relative min-h-[210px] overflow-hidden rounded-[28px] border border-[#ead7ad]/50 bg-white/90 p-6 shadow-[0_18px_45px_rgba(0,0,0,0.05)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_22px_55px_rgba(212,175,55,0.18)] sm:min-h-[230px] sm:p-8 ${
                  isAr ? "text-right" : "text-left"
                }`}
              >
                <div
                  className={`absolute -top-10 h-32 w-32 rounded-full bg-[#d4af37]/10 blur-3xl opacity-0 transition group-hover:opacity-100 ${
                    isAr ? "-right-10" : "-left-10"
                  }`}
                />

                <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#d4af37]/15 text-[#9a7421]">
                  <Icon size={26} />
                </div>

                <h3 className="relative z-10 mt-6 text-xl font-semibold text-[#101827] sm:text-2xl">
                  {featureText.title}
                </h3>

                <p className="relative z-10 mt-3 text-sm leading-7 text-slate-500">
                  {featureText.description}
                </p>
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
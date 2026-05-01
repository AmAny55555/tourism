"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Crown, Gem, Shield, Sparkles, Star } from "lucide-react";
import { useLanguage } from "@/context/language-context";

export default function AboutSection() {
  const { lang, t } = useLanguage();
  const about = t.common.aboutSection;
  const isAr = lang === "ar";

  const stats = [
    {
      icon: Crown,
      value: "+15",
      label: about.stats.experience,
    },
    {
      icon: Gem,
      value: "+500",
      label: about.stats.successfulTrips,
    },
    {
      icon: Star,
      value: "4.9",
      label: about.stats.rating,
    },
  ];

  return (
    <section className="relative overflow-hidden bg-[#f7f0e6] py-14 sm:py-16 lg:py-28">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#d4af37]/50 to-transparent" />

      <div
     dir="ltr"
        className="mx-auto grid max-w-[1280px] gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-14"
      >
        <div className="relative h-[420px] w-full sm:h-[560px] lg:h-[750px]">
          <div className="absolute right-10 top-10 h-[75%] w-[70%] rounded-[2.5rem] bg-gradient-to-br from-[#d4af37]/40 via-transparent to-[#8f6f2a]/40 blur-3xl" />

          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.96 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="group absolute right-0 top-0 z-10 h-[86%] w-[78%] overflow-hidden rounded-b-[2rem] rounded-t-full border-2 border-[#d4af37]/30 shadow-[0_0_60px_rgba(212,175,55,0.25)] sm:h-[88%] sm:w-[75%]"
          >
            <Image
              src="https://images.pexels.com/photos/3889855/pexels-photo-3889855.jpeg?auto=compress&cs=tinysrgb&w=1200"
              alt={about.images.aswanAlt}
              fill
              sizes="(max-width: 768px) 80vw, 520px"
              className="object-cover transition-transform duration-[20s] group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-50" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: isAr ? -50 : 50, y: 40, scale: 0.75 }}
            whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.35 }}
            className="group absolute bottom-12 left-0 z-20 aspect-square w-[56%] overflow-hidden rounded-full border-[6px] border-[#f7f0e6] shadow-[0_25px_60px_rgba(0,0,0,0.45)] sm:bottom-16 sm:w-[58%] sm:border-[8px]"
          >
            <Image
              src="https://images.pexels.com/photos/91409/pexels-photo-91409.jpeg?auto=compress&cs=tinysrgb&w=800"
              alt={about.images.pyramidsAlt}
              fill
              sizes="(max-width: 768px) 60vw, 360px"
              className="object-cover transition-transform duration-[20s] group-hover:scale-110"
            />
            <div className="absolute inset-0 rounded-full ring-1 ring-inset ring-[#d4af37]/30" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.75, y: 35 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.75, ease: "easeOut", delay: 0.7 }}
            className="absolute bottom-0 right-[5%] z-30 hidden md:block"
            dir={isAr ? "rtl" : "ltr"}
          >
            <div
              className={`relative w-72 rounded-2xl border border-white/40 bg-white/30 p-6 shadow-[0_10px_40px_rgba(212,175,55,0.25)] backdrop-blur-xl ${
                isAr ? "text-right" : "text-left"
              }`}
            >
              <div className="absolute right-0 top-0 h-20 w-20 rounded-full bg-[#d4af37]/20 blur-[30px]" />

              <Shield className="mb-3 text-[#d4af37]" />

              <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[#c99b2e]">
                {about.visionLabel}
              </p>

              <p className="text-sm italic leading-relaxed text-[#1f1f1f]">
                &quot;{about.visionText}&quot;
              </p>
            </div>
          </motion.div>
        </div>

        <motion.article
          dir={isAr ? "rtl" : "ltr"}
          initial={{ opacity: 0, x: isAr ? 70 : -70 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.15 }}
          className={`relative overflow-hidden p-1 sm:p-3 lg:p-8 ${
            isAr ? "text-right" : "text-left"
          }`}
        >
          <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-[#d4af37]/15 blur-[120px]" />

          <div className="relative z-10">
            <span className="inline-flex items-center rounded-full border border-[#d4af37]/30 bg-white/50 px-4 py-2 text-sm font-bold text-[#8f6f2a] shadow-sm backdrop-blur-sm">
              <Sparkles
                size={15}
                className={`${isAr ? "ml-2" : "mr-2"} text-[#d4af37]`}
              />
              {about.badge}
            </span>

            <h2 className="mt-6 text-4xl font-bold leading-[1.15] text-[#101827] sm:mt-8 sm:text-5xl md:text-6xl lg:text-7xl">
              <span className="bg-gradient-to-r from-[#8f6f2a] via-[#d4af37] to-[#f3d77b] bg-clip-text text-transparent">
                Taui Traveling
              </span>
              <br />
              {about.title}
            </h2>

            <p className="mt-6 max-w-xl text-base font-light leading-8 text-slate-600 sm:mt-8 sm:text-lg sm:leading-relaxed">
              {about.description}
            </p>

            <div className="mt-8 grid gap-4 sm:mt-10 sm:grid-cols-3 sm:gap-5">
              {stats.map((item, index) => {
                const Icon = item.icon;

                return (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.35 + index * 0.15 }}
                    className="group relative overflow-hidden rounded-3xl border border-[#ead7ad]/70 bg-white/80 p-5 text-center shadow-sm backdrop-blur-md transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_0_35px_rgba(212,175,55,0.25)] sm:p-6"
                  >
                    <Icon className="relative z-10 mx-auto mb-4 text-[#d4af37]" />

                    <p className="relative z-10 bg-gradient-to-r from-[#8f6f2a] via-[#d4af37] to-[#f3d77b] bg-clip-text text-3xl font-bold text-transparent sm:text-4xl">
                      {item.value}
                    </p>

                    <p className="relative z-10 mt-2 text-xs font-semibold uppercase tracking-widest text-slate-500">
                      {item.label}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.article>
      </div>
    </section>
  );
}
"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { useLanguage } from "@/context/language-context";

export default function ContactSection() {
  const { lang, t } = useLanguage();
  const contact = t.common.contactSection;
  const isAr = lang === "ar";

  const features = [
    contact.features.fastResponse,
    contact.features.customPackages,
    contact.features.professionalSupport,
  ];

  return (
    <section
      id="contact"
      dir={isAr ? "rtl" : "ltr"}
      className="relative overflow-hidden bg-[#f7f0e6] py-14 lg:py-20"
    >
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          dir="ltr"
          className="grid overflow-hidden rounded-[28px] bg-white/70 shadow-[0_20px_70px_rgba(0,0,0,0.08)] sm:rounded-[32px] lg:grid-cols-2"
        >
          <div className="relative order-1 min-h-[300px] p-6 sm:min-h-[360px] sm:p-10 lg:order-2 lg:min-h-[480px] lg:p-16">
            <Image
              src="https://images.pexels.com/photos/91409/pexels-photo-91409.jpeg?auto=compress&cs=tinysrgb&w=1200"
              alt={contact.imageAlt}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover opacity-70"
            />

            <div className="absolute inset-0 bg-gradient-to-r from-[#101827]/95 via-[#101827]/70 to-white/20" />
            <div className="absolute inset-0 bg-[#f7f0e6]/15" />

            <div
              dir={isAr ? "rtl" : "ltr"}
              className={`relative z-10 flex h-full flex-col justify-center ${
                isAr ? "text-right" : "text-left"
              }`}
            >
              <span className="mb-5 inline-flex w-fit rounded-full bg-white/90 px-4 py-2 text-xs font-bold text-slate-600">
                {contact.badge}
              </span>

              <h2 className="bg-gradient-to-r from-[#8f6f2a] via-[#d4af37] to-[#f3d77b] bg-clip-text text-3xl font-bold text-transparent sm:text-4xl lg:text-5xl">
                {contact.title}
              </h2>

              <p className="mt-4 max-w-md text-sm leading-7 text-white/85 sm:mt-6 sm:text-base sm:leading-8">
                {contact.description}
              </p>

              <div className="mt-6 space-y-4 sm:mt-10 sm:space-y-5">
                {features.map((item) => (
                  <div key={item} className="flex items-center gap-3 sm:gap-4">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#d4af37]/35 bg-[#d4af37]/15 text-[#d4af37] sm:h-9 sm:w-9">
                      <CheckCircle size={16} />
                    </span>

                    <span className="text-sm font-semibold text-white sm:text-base">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <form
            dir={isAr ? "rtl" : "ltr"}
            className="order-2 space-y-5 bg-white/80 p-5 sm:space-y-6 sm:p-10 lg:order-1 lg:p-16"
          >
            <div className="grid gap-5 sm:gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label
                  className={`block text-xs font-bold text-slate-500 sm:text-sm ${
                    isAr ? "mr-1 text-right" : "ml-1 text-left"
                  }`}
                >
                  {contact.form.fullName}
                </label>

                <input
                  type="text"
                  placeholder={contact.form.fullNamePlaceholder}
                  className={`h-12 w-full rounded-2xl border border-[#ddd6c8] bg-white px-4 outline-none transition focus:border-[#d4af37] sm:h-14 sm:px-5 ${
                    isAr ? "text-right" : "text-left"
                  }`}
                />
              </div>

              <div className="space-y-2">
                <label
                  className={`block text-xs font-bold text-slate-500 sm:text-sm ${
                    isAr ? "mr-1 text-right" : "ml-1 text-left"
                  }`}
                >
                  {contact.form.email}
                </label>

                <input
                  type="email"
                  placeholder="example@mail.com"
                  className={`h-12 w-full rounded-2xl border border-[#ddd6c8] bg-white px-4 outline-none transition focus:border-[#d4af37] sm:h-14 sm:px-5 ${
                    isAr ? "text-right" : "text-left"
                  }`}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label
                  className={`block text-xs font-bold text-slate-500 sm:text-sm ${
                    isAr ? "mr-1 text-right" : "ml-1 text-left"
                  }`}
                >
                  {contact.form.destination}
                </label>

                <input
                  type="text"
                  placeholder={contact.form.destinationPlaceholder}
                  className={`h-12 w-full rounded-2xl border border-[#ddd6c8] bg-white px-4 outline-none transition focus:border-[#d4af37] sm:h-14 sm:px-5 ${
                    isAr ? "text-right" : "text-left"
                  }`}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label
                  className={`block text-xs font-bold text-slate-500 sm:text-sm ${
                    isAr ? "mr-1 text-right" : "ml-1 text-left"
                  }`}
                >
                  {contact.form.tripDetails}
                </label>

                <textarea
                  placeholder={contact.form.tripDetailsPlaceholder}
                  className={`min-h-[120px] w-full resize-none rounded-2xl border border-[#ddd6c8] bg-white px-4 py-3 outline-none transition focus:border-[#d4af37] sm:min-h-[150px] sm:px-5 sm:py-4 ${
                    isAr ? "text-right" : "text-left"
                  }`}
                />
              </div>
            </div>

            <button
              type="button"
              className="h-12 w-full rounded-full bg-[#d4af37] text-sm font-bold text-white shadow-[0_16px_40px_rgba(212,175,55,0.28)] transition hover:-translate-y-1 hover:bg-[#bd982c] sm:h-14 sm:text-base"
            >
              {contact.form.submit}
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
"use client";

import {
  Mail,
  MapPin,
  Phone,
  Send,
  Sparkles,
} from "lucide-react";
import { useLanguage } from "@/context/language-context";

export default function ContactPage() {
  const { lang, t } = useLanguage();
  const contact = t.common.contactPage;
  const isAr = lang === "ar";

  return (
    <main
      dir={isAr ? "rtl" : "ltr"}
      className="min-h-screen bg-white text-[#101827]"
    >
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/532826/pexels-photo-532826.jpeg"
            alt={contact.backgroundAlt}
            className="h-full w-full object-cover opacity-[0.25]"
          />

          <div className="absolute inset-0 bg-white/75" />
          <div className="absolute inset-0 bg-gradient-to-b from-white via-white/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-l from-[#f7f0e6]/40 to-transparent" />
        </div>

        <div className="relative z-10 mx-auto max-w-[1280px] px-4 pb-16 pt-24 sm:px-6 sm:pb-20 sm:pt-28">
          <div className="mx-auto mb-10 max-w-3xl text-center sm:mb-14">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#d4af37]/30 bg-white/80 px-5 py-2 text-sm font-bold text-[#8f6f2a] shadow-sm">
              {contact.badge}
              <Sparkles size={16} className="text-[#d4af37]" />
            </span>

            <h1 className="mt-6 text-4xl font-bold leading-tight sm:text-5xl md:text-6xl">
              {contact.title}
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
              {contact.description}
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:gap-10">
            <section className="rounded-[30px] border border-[#eadfca] bg-white/85 p-5 shadow-[0_25px_80px_rgba(0,0,0,0.08)] backdrop-blur-xl sm:rounded-[42px] sm:p-10">
              <h2 className="mb-8 text-center text-2xl font-bold sm:mb-10 sm:text-3xl">
                {contact.form.title}
              </h2>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-500">
                    {contact.form.fullName}
                  </label>
                  <input
                    placeholder={contact.form.fullNamePlaceholder}
                    className="input-shell"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-500">
                    {contact.form.email}
                  </label>
                  <input
                    type="email"
                    placeholder="example@mail.com"
                    className="input-shell"
                    dir="ltr"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-500">
                    {contact.form.phone}
                  </label>
                  <input
                    placeholder="+20 123 456 7890"
                    className="input-shell"
                    dir="ltr"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-500">
                    {contact.form.tripType}
                  </label>
                  <select className="input-shell">
                    <option>{contact.form.tripTypes.internal}</option>
                    <option>{contact.form.tripTypes.outbound}</option>
                    <option>{contact.form.tripTypes.emiratesVisa}</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-500">
                    {contact.form.destination}
                  </label>
                  <input
                    placeholder={contact.form.destinationPlaceholder}
                    className="input-shell"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-500">
                    {contact.form.tripClass}
                  </label>
                  <select className="input-shell">
                    <option>Economy Class</option>
                    <option>Premium Economy Class</option>
                    <option>Business Class</option>
                    <option>First Class</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-bold text-slate-500">
                    {contact.form.tripDetails}
                  </label>
                  <textarea
                    placeholder={contact.form.tripDetailsPlaceholder}
                    className="min-h-[150px] w-full resize-none rounded-2xl border border-[#ddd6c8] bg-white px-5 py-4 outline-none transition focus:border-[#d4af37] sm:min-h-[170px]"
                  />
                </div>
              </div>

              <button
                type="button"
                className="mt-8 flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-[#d4af37] text-base font-bold text-[#101827] shadow-[0_18px_45px_rgba(212,175,55,0.28)] transition-all duration-300 hover:-translate-y-1 hover:bg-[#bd982c] sm:h-16 sm:text-lg"
              >
                {contact.form.submit}
                <Send size={22} />
              </button>
            </section>

            <aside className="space-y-5 sm:space-y-6">
              <InfoCard
                icon={<MapPin size={30} />}
                title={contact.info.location.title}
                text={contact.info.location.text}
              />

              <InfoCard
                icon={<Phone size={30} />}
                title={contact.info.phone.title}
                text={contact.info.phone.text}
                secondText={contact.info.phone.secondText}
              />

              <InfoCard
                icon={<Mail size={30} />}
                title={contact.info.email.title}
                text={contact.info.email.text}
                secondText={contact.info.email.secondText}
              />
            </aside>
          </div>
        </div>
      </section>

      <style jsx global>{`
        .input-shell {
          height: 58px;
          width: 100%;
          border-radius: 18px;
          border: 1px solid #ddd6c8;
          background: white;
          padding: 0 20px;
          text-align: ${isAr ? "right" : "left"};
          outline: none;
          transition: 0.25s ease;
        }

        .input-shell:focus {
          border-color: #d4af37;
          box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.12);
        }
      `}</style>
    </main>
  );
}

function InfoCard({
  icon,
  title,
  text,
  secondText,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
  secondText?: string;
}) {
  return (
    <div className="rounded-[30px] border border-[#eadfca] bg-white/85 p-6 text-center shadow-[0_20px_60px_rgba(0,0,0,0.06)] backdrop-blur-xl sm:rounded-[36px] sm:p-8">
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-3xl bg-[#f7f0e6] text-[#d4af37] sm:mb-8 sm:h-20 sm:w-20">
        {icon}
      </div>

      <h3 className="mb-3 text-xl font-bold sm:mb-4 sm:text-2xl">
        {title}
      </h3>

      <p className="break-words text-base leading-8 text-slate-600 sm:text-lg">
        {text}
      </p>

      {secondText && (
        <p className="break-words text-base leading-8 text-slate-600 sm:text-lg">
          {secondText}
        </p>
      )}
    </div>
  );
}
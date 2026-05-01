"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import axios from "@/lib/axios";
import { useLanguage } from "@/context/language-context";

type TravelCountry = {
  id: number;
  name: string;
  slug: string;
  image: string | null;
  is_active: boolean;
};

async function getCountries() {
  const res = await axios.get("/travel-countries");
  return res.data.countries as TravelCountry[];
}

export default function ExternalTravelPage() {
  const { lang, t } = useLanguage();
  const text = t.common.externalTravelPage;
  const isAr = lang === "ar";

  const { data: countries = [], isLoading } = useQuery({
    queryKey: ["travel-countries"],
    queryFn: getCountries,
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7f0e6] px-4">
        <div className="rounded-3xl border border-[#ead7ad] bg-white px-6 py-5 text-center font-black text-[#06142b] shadow-sm sm:px-8 sm:py-6">
          {text.loading}
        </div>
      </div>
    );
  }

  return (
    <main
      dir={isAr ? "rtl" : "ltr"}
      className="min-h-screen bg-[#f7f0e6] text-[#101827]"
    >
      <section className="relative">
        <div className="relative h-[520px] overflow-hidden rounded-b-[48px] sm:h-[620px] sm:rounded-b-[70px] lg:rounded-b-[90px]">
          <img
            src="https://images.pexels.com/photos/358319/pexels-photo-358319.jpeg"
            alt={text.hero.imageAlt}
            className="absolute inset-0 h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-black/45" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-[#8f6f2a]/35 to-transparent" />

          <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center text-white sm:px-6">
            <span className="mb-5 inline-flex rounded-full border border-white/20 bg-white/10 px-5 py-2 text-xs font-bold text-[#f4c542] backdrop-blur-md">
              {text.hero.badge}
            </span>

            <h1 className="max-w-4xl text-4xl font-black leading-tight sm:text-5xl md:text-7xl">
              {text.hero.title}
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-8 text-white/90 sm:mt-6 sm:text-lg">
              {text.hero.description}
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] px-4 py-14 sm:px-6 sm:py-16 lg:py-20">
        <div
          className={`mb-10 ${
            isAr ? "text-right" : "text-left"
          }`}
        >
          <span className="inline-flex rounded-full border border-[#d4af37]/30 bg-white/70 px-4 py-2 text-xs font-bold text-[#8f6f2a] shadow-sm">
            {text.section.badge}
          </span>

          <h2 className="mt-4 text-3xl font-black leading-tight sm:text-4xl">
            {text.section.title}
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
            {text.section.description}
          </p>
        </div>

        {countries.length === 0 ? (
          <div className="rounded-[28px] border border-dashed border-[#d8c69c] bg-white/80 p-10 text-center">
            <p className="text-lg font-black text-[#06142b]">
              {text.empty}
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {countries.map((country) => (
              <article
                key={country.id}
                className="group overflow-hidden rounded-[28px] border border-[#ead7ad]/60 bg-white shadow-sm transition duration-500 hover:-translate-y-2 hover:shadow-[0_24px_60px_rgba(212,175,55,0.18)] sm:rounded-[34px]"
              >
                <div className="relative h-[220px] overflow-hidden sm:h-[240px]">
                  <img
                    src={
                      country.image ||
                      "https://images.pexels.com/photos/2044434/pexels-photo-2044434.jpeg"
                    }
                    alt={country.name}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
                </div>

                <div
                  className={`p-5 sm:p-6 ${
                    isAr ? "text-right" : "text-left"
                  }`}
                >
                  <h3 className="break-words text-2xl font-black text-[#06142b]">
                    {country.name}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-slate-500">
                    {text.card.description}
                  </p>

                  <div className="mt-6">
                    <Link
                      href={`/foreign-trips/${country.id}`}
                      className="inline-flex items-center justify-center rounded-full bg-[#d4af37] px-6 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#b8952c]"
                    >
                      {text.card.button}
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
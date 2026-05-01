"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import axios from "@/lib/axios";
import { Clock, MapPin, Star } from "lucide-react";
import { useLanguage } from "@/context/language-context";
import Loading from "@/app/loading";

type TravelCountry = {
  id: number;
  name: string;
  slug: string;
  image: string | null;
  is_active: boolean;
};
type Country = {
  id: number;
  name: string;
  name_ar?: string | null;
  name_en?: string | null;
  slug?: string;
  image?: string | null;
};

async function getCountries() {
  const res = await axios.get("/travel-countries");
  return res.data.countries as TravelCountry[];
}

export default function OutboundPage() {
  const { lang, t } = useLanguage();

  const text = t.common.outboundPage;
  const isAr = lang === "ar";

  const { data: countries = [], isLoading } = useQuery({
    queryKey: ["travel-countries"],
    queryFn: getCountries,
  });

  const tags = [
    text.card.tags.review,
    text.card.tags.offer,
    text.card.tags.confirmation,
  ];

  return (
    <main
      dir={isAr ? "rtl" : "ltr"}
      className="min-h-screen bg-[#f7f0e6] text-[#101827]"
    >
      <section className="relative">
        <div className="relative h-[520px] overflow-hidden rounded-b-[42px] sm:h-[600px] sm:rounded-b-[70px] lg:h-[620px] lg:rounded-b-[90px]">
          <img
            src="https://images.pexels.com/photos/358319/pexels-photo-358319.jpeg"
            alt={text.hero.imageAlt}
            className="absolute inset-0 h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-black/45" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-[#8f6f2a]/35 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#d4af37]/35 to-transparent" />

          <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center text-white sm:px-6">
            <span className="mb-5 rounded-full border border-white/25 bg-white/20 px-5 py-2.5 text-xs font-bold backdrop-blur-md sm:px-6 sm:py-3 sm:text-sm">
              {text.hero.badge}
            </span>

            <h1 className="max-w-4xl text-4xl font-black leading-tight sm:text-5xl md:text-6xl lg:text-7xl">
              {text.hero.title}
            </h1>

            <p className="mt-5 max-w-2xl text-sm font-medium leading-7 text-white/90 sm:mt-6 sm:text-lg sm:leading-8">
              {text.hero.description}
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] px-4 py-14 sm:px-6 sm:py-16 lg:py-20">
        <div
          className={`mb-8 flex w-full items-center gap-2 sm:mb-10 ${
            isAr ? "justify-start text-right" : "justify-start text-left"
          }`}
        >
          <span className="text-2xl text-[#d4af37] sm:text-3xl">✧</span>

          <h2 className="text-2xl font-black leading-tight sm:text-4xl">
            {text.section.title}
          </h2>
        </div>
{isLoading ? (
  <Loading />
) : countries.length === 0 ? (
          <div className="rounded-[28px] border border-[#e8dfcf] bg-white p-7 text-center shadow sm:rounded-[34px] sm:p-10">
            <p className="text-base font-bold leading-7 text-slate-500 sm:text-lg">
              {text.empty}
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {countries.map((country) => (
              <article
                key={country.id}
                className="group overflow-hidden rounded-[28px] bg-white shadow-[0_20px_70px_rgba(0,0,0,0.08)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_30px_90px_rgba(0,0,0,0.14)] sm:rounded-[34px] lg:hover:-translate-y-4"
              >
                <div className="relative h-[230px] overflow-hidden sm:h-[250px] lg:h-[260px]">
                  <img
                    src={
                      country.image ||
                      "https://images.pexels.com/photos/2044434/pexels-photo-2044434.jpeg"
                    }
                    alt={isAr ? country.name_ar || country.name : country.name_en || country.name}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent" />

                  <div
                    className={`absolute bottom-4 rounded-full border border-white/40 bg-black/55 px-4 py-2 text-xs font-bold text-white backdrop-blur-md sm:text-sm ${
                      isAr ? "left-4" : "right-4"
                    }`}
                  >
                  {isAr ? country.name_ar || country.name : country.name_en || country.name}
                  </div>

                  <div
                    className={`absolute bottom-4 rounded-full bg-[#d4af37] px-4 py-2 text-xs font-bold text-white sm:text-sm ${
                      isAr ? "right-4" : "left-4"
                    }`}
                  >
                    {text.card.badge}
                  </div>
                </div>

                <div className={isAr ? "p-5 text-right sm:p-6" : "p-5 text-left sm:p-6"}>
                  <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <span className="inline-flex w-fit items-center gap-1 rounded-full bg-[#f7f0e6] px-4 py-2 text-sm font-bold text-[#8f6f2a]">
                      4.9
                      <Star
                        size={15}
                        fill="#d4af37"
                        className="text-[#d4af37]"
                      />
                    </span>

                    <span className="flex items-center gap-1 text-sm font-semibold text-slate-500">
                     <span className="break-words">
  {isAr ? country.name_ar || country.name : country.name_en || country.name}
</span>
                      <MapPin size={16} className="shrink-0 text-[#d4af37]" />
                    </span>
                  </div>

                  <h3 className="break-words text-xl font-black leading-8 sm:text-2xl">
                    {text.card.title} {isAr ? country.name_ar || country.name : country.name_en || country.name}
                  </h3>

                  <p className="mt-4 min-h-[56px] text-sm leading-7 text-slate-500">
                    {text.card.description}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-[#e8dfcf] bg-white px-3 py-1 text-xs font-semibold text-slate-500"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <Link
                      href={`/foreign-trips/${country.id}`}
                      className="inline-flex justify-center rounded-full border border-[#d4af37]/40 px-6 py-3 text-sm font-bold text-[#101827] transition hover:bg-[#d4af37] hover:text-white"
                    >
                      {text.card.button}
                    </Link>

                    <span className="flex items-center justify-center gap-1 text-sm font-semibold text-slate-500 sm:justify-start">
                      {text.card.duration}
                      <Clock size={16} className="shrink-0 text-[#d4af37]" />
                    </span>
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
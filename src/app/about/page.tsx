"use client";

import { useEffect, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Globe,
  ShieldCheck,
  Heart,
  Star,
  Quote,
  Users,
  Medal,
} from "lucide-react";
import axios from "@/lib/axios";
import { useLanguage } from "@/context/language-context";

const stats = [
  { key: "years", icon: Medal },
  { key: "travelers", icon: Users },
  { key: "destinations", icon: Globe },
  { key: "trips", icon: Heart },
] as const;

const infoCards = [
  { key: "vision", icon: ShieldCheck },
  { key: "mission", icon: Globe },
] as const;

const philosophies = [
  { key: "exclusivity" },
  { key: "personalization" },
  { key: "reliability" },
] as const;

type Review = {
  id: number;
  rating: number;
  comment: string;
  user?: {
    name?: string;
  };
};

function getInitials(name?: string) {
  if (!name) return "TA";

  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export default function AboutPageSections() {
  const { lang, t } = useLanguage();
  const aboutPage = t.common.aboutPage;
  const isAr = lang === "ar";

  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get("/reviews");
        setReviews(res.data.reviews || []);
      } catch {
        setReviews([]);
      }
    };

    fetchReviews();
  }, []);

  return (
    <main dir={isAr ? "rtl" : "ltr"} className="overflow-hidden bg-white">
      <section className="relative flex min-h-[620px] flex-col items-center justify-center overflow-visible bg-gradient-to-b from-[#b8b8b8] via-[#575757] to-[#1f1f1f] px-4 py-20 text-center sm:px-6 lg:min-h-[680px]">
        <div className="relative z-10 -mt-8">
          <span className="mb-8 inline-block rounded-full border border-[#d4af37]/30 bg-[#d4af37]/10 px-5 py-3 text-[10px] font-bold tracking-[4px] text-[#d4af37] sm:mb-12 sm:px-10 sm:text-xs sm:tracking-[8px]">
            {aboutPage.hero.badge}
          </span>

          <h1 className="text-[42px] font-bold leading-[1.15] text-white sm:text-[58px] lg:text-[92px]">
            {aboutPage.hero.titleLineOne}
            <span className="mt-2 block text-[#d4af37]">
              {aboutPage.hero.titleLineTwo}
            </span>
          </h1>

          <p className="mx-auto mt-8 max-w-4xl text-base italic leading-8 text-white/90 sm:text-xl lg:mt-10 lg:text-2xl">
            &quot;{aboutPage.hero.description}&quot;
          </p>

          <div className="mx-auto mt-6 h-14 w-px bg-[#d4af37] sm:h-16" />
        </div>

        <div className="absolute -bottom-24 z-20 grid w-full grid-cols-2 gap-4 px-4 sm:px-6 md:grid-cols-4 lg:gap-8 lg:px-10">
          {stats.map((item) => {
            const Icon = item.icon;
            const stat = aboutPage.stats[item.key];

            return (
              <div
                key={item.key}
                className="flex h-[160px] flex-col items-center justify-center rounded-[28px] border border-white/20 bg-gradient-to-b from-[#343434]/90 via-[#8f8f8f]/70 to-white shadow-[0_30px_60px_rgba(0,0,0,.16)] sm:h-[220px] sm:rounded-[38px]"
              >
                <Icon className="mb-4 text-[#d4af37] sm:mb-7" size={30} />

                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-bold text-[#d4af37] sm:text-2xl">
                    +
                  </span>
                  <span className="font-serif text-4xl font-bold text-white drop-shadow-md sm:text-5xl">
                    {stat.number}
                  </span>
                </div>

                <p className="mt-3 px-2 text-center text-xs font-bold text-[#6f6f6f] sm:mt-4 sm:text-base">
                  {stat.text}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section
        className="relative bg-white px-4 pb-16 pt-40 sm:px-6 lg:px-20 lg:pb-20"
        dir={isAr ? "rtl" : "ltr"}
      >
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="group h-[420px] overflow-hidden rounded-[32px] border-[10px] border-white shadow-[0_0_45px_rgba(212,175,55,.18)] sm:h-[560px] lg:h-[720px] lg:rounded-[42px] lg:border-[14px]">
            <img
              src="https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&q=80"
              alt={aboutPage.story.imageAlt}
              className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110"
            />
          </div>

          <div className={isAr ? "text-right" : "text-left"}>
            <div
              className={`mb-8 flex items-center gap-4 ${
                isAr ? "justify-start flex-row-reverse" : "justify-start"
              }`}
            >
              <span className="h-[2px] w-16 bg-[#d4af37]" />
              <span className="text-lg font-bold text-[#d4af37] sm:text-xl">
                {aboutPage.story.label}
              </span>
            </div>

            <h2 className="mb-8 font-serif text-4xl leading-tight text-[#071b3a] sm:text-5xl lg:mb-10 lg:text-7xl">
              {aboutPage.story.titleLineOne}
              <span className="block text-[#c59a23] italic">
                {aboutPage.story.titleLineTwo}
              </span>
            </h2>

            <p className="mb-10 text-base leading-8 text-[#53637a] sm:text-xl lg:mb-14 lg:text-2xl lg:leading-relaxed">
              {aboutPage.story.description}
            </p>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
              {infoCards.map((card) => {
                const Icon = card.icon;
                const cardText = aboutPage.story.cards[card.key];

                return (
                  <InfoCard
                    key={card.key}
                    icon={Icon}
                    title={cardText.title}
                    text={cardText.text}
                    isAr={isAr}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#020303] px-4 py-16 text-white sm:px-6 lg:px-20 lg:py-24">
        <div
          className="absolute inset-0 opacity-[0.045]"
          style={{
            backgroundImage: `
              linear-gradient(30deg, transparent 24%, rgba(255,255,255,.8) 25%, rgba(255,255,255,.8) 26%, transparent 27%, transparent 74%, rgba(255,255,255,.8) 75%, rgba(255,255,255,.8) 76%, transparent 77%),
              linear-gradient(150deg, transparent 24%, rgba(255,255,255,.8) 25%, rgba(255,255,255,.8) 26%, transparent 27%, transparent 74%, rgba(255,255,255,.8) 75%, rgba(255,255,255,.8) 76%, transparent 77%)
            `,
            backgroundSize: "86px 50px",
          }}
        />

        <div className="relative z-10 mb-14 text-center lg:mb-28">
          <h2 className="font-serif text-4xl leading-tight sm:text-5xl lg:text-7xl">
            {aboutPage.philosophy.titleLineOne}
            <span className="text-[#d4af37] italic">
              {" "}
              {aboutPage.philosophy.titleLineTwo}
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-4xl text-base leading-8 text-gray-400 sm:text-xl lg:mt-8">
            {aboutPage.philosophy.description}
          </p>
        </div>

        <div className="relative z-10 grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-12">
          {philosophies.map((item) => {
            const philosophy = aboutPage.philosophy.items[item.key];

            return (
              <div
                key={item.key}
                className="relative min-h-[320px] overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.018] p-8 text-center lg:min-h-[380px] lg:rounded-[42px] lg:p-12"
              >
                <div
                  className={`absolute top-10 text-5xl font-black italic text-white/20 lg:top-12 lg:text-7xl ${
                    isAr ? "right-10 lg:right-12" : "left-10 lg:left-12"
                  }`}
                >
                  {philosophy.number}
                </div>

                <span className="mb-8 mt-10 inline-block rounded-full border border-[#d4af37]/20 bg-[#d4af37]/10 px-5 py-2 text-xs font-bold text-[#d4af37] lg:mb-12">
                  {philosophy.tag}
                </span>

                <h3 className="mb-6 font-serif text-3xl lg:mb-10 lg:text-4xl">
                  {philosophy.title}
                </h3>

                <p className="text-base leading-8 text-[#9fb1c9] lg:text-xl lg:leading-relaxed">
                  {philosophy.text}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="relative bg-white px-4 py-16 sm:px-6 lg:px-20 lg:py-28">
        <div className="mb-14 grid grid-cols-1 items-center gap-10 lg:mb-24 lg:grid-cols-2">
          <div className={`order-1 ${isAr ? "text-right" : "text-left"}`}>
            <span className="mb-6 inline-block rounded-full border border-[#eadfbf] bg-[#fff9ea] px-6 py-2 font-bold text-[#d4af37] lg:mb-8 lg:px-8">
              {aboutPage.testimonials.badge}
            </span>

            <h2 className="text-4xl font-bold leading-tight text-[#071b3a] sm:text-6xl lg:text-8xl">
              {aboutPage.testimonials.titleLineOne}
              <span className="mt-4 block text-[#c59a23] lg:mt-8">
                {aboutPage.testimonials.titleLineTwo}
              </span>
            </h2>
          </div>

          <div
            className={`order-2 mt-4 flex items-center gap-6 lg:mt-0 lg:gap-8 ${
              isAr ? "justify-start" : "justify-end"
            }`}
          >
            <span className="h-20 w-[2px] bg-[#d4af37] lg:h-24" />

            <p
              className={`text-base italic leading-8 text-[#66748a] sm:text-xl lg:text-2xl ${
                isAr ? "text-right" : "text-left"
              }`}
            >
              &quot;{aboutPage.testimonials.quote}&quot;
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 lg:gap-12">
          {reviews.length === 0 ? (
            <div className="col-span-full rounded-[32px] border border-[#e6edf5] bg-[#f8fafc] p-10 text-center">
              <p className="text-xl font-bold text-[#66748a]">
                لا توجد آراء حالياً
              </p>
            </div>
          ) : (
            reviews.map((review) => (
              <div
                key={review.id}
                className={`flex min-h-[380px] flex-col justify-between rounded-[32px] border border-[#e6edf5] bg-[#f8fafc] p-7 lg:min-h-[430px] lg:rounded-[42px] lg:p-12 ${
                  isAr ? "text-right" : "text-left"
                }`}
              >
                <div>
                  <div
                    className={`mb-8 flex gap-1 text-[#d4af37] lg:mb-10 ${
                      isAr ? "justify-end" : "justify-start"
                    }`}
                  >
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={20}
                        fill={
                          star <= Number(review.rating)
                            ? "currentColor"
                            : "none"
                        }
                        className={
                          star <= Number(review.rating)
                            ? "text-[#d4af37]"
                            : "text-gray-300"
                        }
                      />
                    ))}
                  </div>

                  <Quote
                    className={`mb-8 text-[#efe6c9] ${
                      isAr ? "mr-auto" : "ml-auto"
                    }`}
                    size={54}
                  />

                  <p className="text-base italic leading-8 text-[#1c2c44] sm:text-xl lg:text-2xl lg:leading-relaxed">
                    &quot;{review.comment}&quot;
                  </p>
                </div>

                <div>
                  <div className="my-8 h-px bg-[#dfe7ef] lg:my-10" />

                  <div
                    className={`flex items-center gap-5 ${
                      isAr ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div>
                      <h4 className="text-xl font-bold text-[#071b3a]">
                        {review.user?.name || "Taui Customer"}
                      </h4>

                      <p className="mt-1 text-sm font-bold tracking-[3px] text-[#d4af37]">
                        TAUI REVIEW
                      </p>
                    </div>

                    <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-white bg-[#06142b] text-xl font-black text-[#d4af37] shadow-md">
                      {getInitials(review.user?.name)}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  );
}

function InfoCard({
  icon: Icon,
  title,
  text,
  isAr,
}: {
  icon: LucideIcon;
  title: string;
  text: string;
  isAr: boolean;
}) {
  return (
    <div
      className={`min-h-[220px] rounded-[28px] border border-[#e6edf5] bg-[#f8fafc] p-7 lg:min-h-[230px] lg:rounded-[32px] lg:p-10 ${
        isAr ? "text-right" : "text-left"
      }`}
    >
      <div
        className={`mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-md ${
          isAr ? "mr-auto" : "ml-auto"
        }`}
      >
        <Icon className="text-[#d4af37]" size={30} />
      </div>

      <h3 className="mb-5 text-2xl font-bold text-[#071b3a]">{title}</h3>

      <p className="text-base leading-8 text-[#7b8798] lg:text-xl lg:leading-relaxed">
        {text}
      </p>
    </div>
  );
}
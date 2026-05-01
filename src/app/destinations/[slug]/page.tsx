"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import { useParams } from "next/navigation";
import { useLanguage } from "@/context/language-context";
import { CalendarDays, Clock, MapPin, Star } from "lucide-react";

export default function DestinationPage() {
  const { slug } = useParams();
  const { t, lang } = useLanguage();

  const text = t.common.destinationDetailsPage;
  
  const isAr = lang === "ar";

  const [destination, setDestination] = useState<any>(null);

  useEffect(() => {
    const fetchDestination = async () => {
      const res = await axios.get(`/destinations/${slug}`);
      setDestination(res.data.destination);
    };

    fetchDestination();
  }, [slug]);

  const getImageUrl = (image?: string | null) => {
    if (!image) {
      return "https://images.pexels.com/photos/532826/pexels-photo-532826.jpeg";
    }

    if (image.startsWith("http")) {
      return image;
    }

    return `http://localhost:8000/storage/${image}`;
  };

  if (!destination) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#fbf7ef]">
        <p className="font-black text-[#06142b]">
          {text?.loading || "جاري التحميل..."}
        </p>
      </main>
    );
  }

  const landmarks =
    typeof destination.landmarks === "string"
      ? JSON.parse(destination.landmarks || "[]")
      : destination.landmarks || [];

  return (
    <main dir={isAr ? "rtl" : "ltr"} className="min-h-screen bg-[#fbf7ef]">
      <section className="relative h-[430px] overflow-hidden sm:h-[520px]">
        <img
          src={getImageUrl(destination.cover_image || destination.image)}
          alt={destination.name}
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-black/65" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-52 bg-gradient-to-t from-[#d4af37]/45 to-transparent" />

        <div className="absolute bottom-10 left-4 right-4 mx-auto max-w-6xl text-white sm:bottom-14 sm:px-6">
          <span className="mb-5 inline-flex rounded-full border border-white/25 bg-white/20 px-5 py-2 text-sm font-black text-[#f4c542] backdrop-blur-md">
            TAUI ✦
          </span>

          <h1 className="text-4xl font-black leading-tight sm:text-6xl">
            {destination.name}
          </h1>

          <div className="mt-5 flex flex-wrap gap-4 text-sm font-bold text-white/90 sm:gap-6">
            <span className="flex items-center gap-2">
              {destination.rating || 4.5}
              <Star size={17} fill="#d4af37" className="text-[#d4af37]" />
            </span>

            <span className="flex items-center gap-2">
              {destination.days || 1} {text?.days || "أيام"}
              <Clock size={17} className="text-[#d4af37]" />
            </span>

            {destination.location && (
              <span className="flex items-center gap-2">
                {destination.location}
                <MapPin size={17} className="text-[#d4af37]" />
              </span>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="space-y-8">
            {(destination.overview || destination.description) && (
              <div className="rounded-[30px] border border-[#eadfca] bg-white p-6 shadow-sm sm:p-8">
                <h2 className="mb-4 text-2xl font-black text-[#06142b]">
                  {text?.overview || "نبذة عن المحافظة"}
                </h2>

                <p className="text-base font-bold leading-8 text-[#667085]">
                  {destination.overview || destination.description}
                </p>
              </div>
            )}

            {landmarks.length > 0 && (
              <div className="rounded-[30px] border border-[#eadfca] bg-white p-6 shadow-sm sm:p-8">
                <h2 className="mb-5 text-2xl font-black text-[#06142b]">
                  {text?.landmarks || "أشهر المعالم"}
                </h2>

                <div className="grid gap-3 sm:grid-cols-2">
                  {landmarks.map((item: string, index: number) => (
                    <div
                      key={index}
                      className="rounded-2xl border border-[#eadfca] bg-[#fffaf0] px-5 py-4 font-black text-[#06142b]"
                    >
                      ✦ {item}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {destination.best_time_to_visit && (
              <div className="rounded-[30px] border border-[#eadfca] bg-white p-6 shadow-sm sm:p-8">
                <h2 className="mb-4 text-2xl font-black text-[#06142b]">
                  {text?.bestTime || "أفضل وقت للزيارة"}
                </h2>

                <p className="font-bold leading-8 text-[#667085]">
                  {destination.best_time_to_visit}
                </p>
              </div>
            )}
          </div>

          <aside className="h-fit rounded-[30px] border border-[#eadfca] bg-white p-6 shadow-[0_20px_70px_rgba(212,175,55,0.14)] lg:sticky lg:top-8">
            <div className="rounded-[24px] bg-[#fffaf0] p-5">
              <p className="text-sm font-black text-[#8f6f2a]">
                {text?.priceTitle || "سعر الرحلة"}
              </p>

              <h3 className="mt-2 text-3xl font-black text-[#06142b]">
                {Number(destination.price || 0).toLocaleString()}{" "}
                {text?.currency || "جنيه"}
              </h3>
            </div>

        <Link
  href={`/tours/${destination.slug}`}
  className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-[#06142b] px-6 py-4 text-base font-black text-[#f4c542] shadow-lg transition hover:-translate-y-1 hover:bg-[#0b1f3f]"
>
  <CalendarDays size={19} />
  {text?.bookNow || "احجز الرحلة"}
</Link>

            <div className="mt-5 rounded-2xl bg-green-50 p-4 text-sm font-bold leading-6 text-green-700">
              {text?.reviewNote ||
                "بعد إرسال الطلب، سيقوم الأدمن بتجهيز تفاصيل الفندق والمواصلات والسعر النهائي."}
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
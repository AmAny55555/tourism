"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, Star, Clock, ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import { useLanguage } from "@/context/language-context";

type Destination = {
  id: number;
  name: string;
  slug: string;
  location?: string;
  category?: string;
  price?: number;
  rating?: number;
  days?: number;
  badge?: string;
  description?: string;
  image?: string;
};

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.18,
      delayChildren: 0.2,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6 },
  },
};

function getImageUrl(image?: string) {
  if (!image) {
    return "https://images.pexels.com/photos/532826/pexels-photo-532826.jpeg";
  }

  if (image.startsWith("http")) return image;

  return `http://localhost:8000/storage/${image}`;
}

export default function ToursSection() {
  const { lang, t } = useLanguage();
  const toursSection = t.common.toursSection;
  const isAr = lang === "ar";

  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const res = await axios.get("/destinations");
        setDestinations((res.data.destinations || []).slice(0, 4));
      } catch {
        setDestinations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDestinations();
  }, []);

  return (
    <section
      dir={isAr ? "rtl" : "ltr"}
      className="relative overflow-hidden bg-[#f7f0e6] py-14 lg:py-20"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#d4af37]/25 to-transparent" />

      <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
          className="mx-auto mb-10 max-w-3xl text-center sm:mb-12"
        >
          <span className="inline-block rounded-full border border-[#d4af37]/30 bg-white/60 px-4 py-2 text-xs font-bold text-[#8f6f2a] shadow-sm backdrop-blur-md">
            {toursSection.badge}
          </span>

          <h2 className="mt-5 text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
            <span className="bg-gradient-to-r from-[#8f6f2a] via-[#d4af37] to-[#f3d77b] bg-clip-text text-transparent">
              {toursSection.title}
            </span>
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
            {toursSection.description}
          </p>
        </motion.div>

        {loading ? (
          <div className="rounded-[28px] border border-[#ead7ad] bg-white/80 p-8 text-center font-black text-[#8f6f2a]">
            {isAr ? "جاري تحميل الرحلات..." : "Loading trips..."}
          </div>
        ) : destinations.length === 0 ? (
          <div className="rounded-[28px] border border-dashed border-[#ead7ad] bg-white/80 p-8 text-center font-black text-[#8f6f2a]">
            {isAr ? "لا توجد رحلات حالياً" : "No trips available yet"}
          </div>
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="grid gap-5 sm:grid-cols-2 lg:gap-6 xl:grid-cols-4"
          >
            {destinations.map((destination) => (
              <motion.article
                key={destination.id}
                variants={item}
                className={`group overflow-hidden rounded-[28px] border border-[#ead7ad]/50 bg-white/90 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(212,175,55,0.2)] ${
                  isAr ? "text-right" : "text-left"
                }`}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={getImageUrl(destination.image)}
                    alt={destination.name}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

                  {destination.badge && (
                    <span className="absolute top-4 right-4 rounded-full bg-[#d4af37] px-3 py-1 text-xs font-black text-white">
                      {destination.badge}
                    </span>
                  )}

                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-2xl font-black text-white">
                      {destination.name}
                    </h3>

                    {destination.location && (
                      <p className="mt-1 flex items-center gap-1 text-sm font-bold text-white/85">
                        <MapPin size={15} className="text-[#d4af37]" />
                        {destination.location}
                      </p>
                    )}
                  </div>
                </div>

                <div className="p-6">
                  <div className="mb-4 flex flex-wrap items-center gap-3 text-xs font-black text-[#667085]">
                    <span className="flex items-center gap-1">
                      <Star size={15} fill="#d4af37" className="text-[#d4af37]" />
                      {destination.rating || 4.5}
                    </span>

                    <span className="flex items-center gap-1">
                      <Clock size={15} className="text-[#d4af37]" />
                      {destination.days || 1} {isAr ? "أيام" : "days"}
                    </span>
                  </div>

                  <p className="line-clamp-3 min-h-[72px] text-sm leading-7 text-slate-500">
                    {destination.description ||
                      (isAr
                        ? "رحلة مميزة بتفاصيل منظمة وتجربة سفر مختلفة."
                        : "A special trip with organized details and a unique travel experience.")}
                  </p>

                  <div className="mt-5 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold text-slate-400">
                        {isAr ? "يبدأ من" : "From"}
                      </p>
                      <p className="text-lg font-black text-[#101827]">
                        {Number(destination.price || 0).toLocaleString()}{" "}
                        {isAr ? "جنيه" : "EGP"}
                      </p>
                    </div>

                    <Link
                      href={`/destinations/${destination.slug}`}
                      className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#06142b] text-[#d4af37] transition hover:bg-[#102a55]"
                    >
                      {isAr ? <ArrowLeft size={18} /> : <ArrowRight size={18} />}
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))}
          </motion.div>
        )}

        <div className="mt-10 text-center">
          <Link
            href="/tours"
            className="inline-flex rounded-full bg-[#d4af37] px-7 py-3 text-sm font-black text-white shadow-lg shadow-[#d4af37]/25 transition hover:-translate-y-1 hover:bg-[#b8962e]"
          >
            {toursSection.button}
          </Link>
        </div>
      </div>
    </section>
  );
}
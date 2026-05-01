"use client";

import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import { useLanguage } from "@/context/language-context";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

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

export default function TestimonialsSection() {
  const { lang, t } = useLanguage();
  const testimonialsSection = t.common.testimonialsSection;
  const isAr = lang === "ar";

  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get("/reviews");
        setReviews(res.data.reviews || []);
      } catch {
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  return (
    <section
      dir={isAr ? "rtl" : "ltr"}
      className="relative overflow-hidden bg-[#f7f0e6] py-14 lg:py-20"
    >
      <div className="relative z-10 mx-auto max-w-[1280px] px-4 sm:px-6">

        {/* HEADER */}
        <div className="mx-auto mb-10 text-center">
          <span className="inline-flex rounded-full border border-[#d4af37]/25 bg-white/60 px-4 py-2 text-xs font-bold text-[#8f6f2a]">
            {testimonialsSection.badge}
          </span>

          <h2 className="mt-4 text-3xl font-bold sm:text-4xl">
            {testimonialsSection.title}
          </h2>

          <p className="mt-3 text-sm text-slate-600">
            {testimonialsSection.description}
          </p>
        </div>

        {/* 🔥 الحالات */}

        {loading ? (
          <p className="text-center font-bold text-[#8f6f2a]">
            جاري تحميل الآراء...
          </p>
        ) : reviews.length === 0 ? (
          <p className="text-center font-bold text-[#8f6f2a]">
            لا توجد آراء حالياً
          </p>
        ) : (
          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={24}
            slidesPerView={1}
            pagination={{ clickable: true }}
            autoplay={{ delay: 3500 }}
            breakpoints={{
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
          >
            {reviews.map((review) => (
              <SwiperSlide key={review.id}>
                <motion.article
                  className={`relative rounded-[28px] border border-[#ead7ad]/40 bg-white/90 p-6 shadow ${
                    isAr ? "text-right" : "text-left"
                  }`}
                >
                  <Quote
                    size={50}
                    className="absolute top-4 right-4 text-[#d4af37]/20"
                  />

                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black text-[#f3d77b] font-bold">
                      {getInitials(review.user?.name)}
                    </div>

                    <div>
                      <p className="font-bold">
                        {review.user?.name || "Taui User"}
                      </p>

                      <div className="flex gap-1 mt-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            fill={i < review.rating ? "#d4af37" : "none"}
                            className={
                              i < review.rating
                                ? "text-[#d4af37]"
                                : "text-gray-300"
                            }
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <p className="mt-5 text-sm text-slate-600">
                    "{review.comment}"
                  </p>
                </motion.article>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </section>
  );
}
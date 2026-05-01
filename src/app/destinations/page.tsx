"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "@/lib/axios";
import { MapPin, Star, Clock } from "lucide-react";
import { useLanguage } from "@/context/language-context";

type Destination = {
  id: number;
  name: string;
  slug: string;
  location?: string;
  price?: number;
  rating?: number;
  days?: number;
  description?: string;
  image?: string;
  badge?: string;
};

function getImageUrl(image?: string) {
  if (!image) return "https://images.pexels.com/photos/532826/pexels-photo-532826.jpeg";
  if (image.startsWith("http")) return image;
  return `http://localhost:8000/storage/${image}`;
}

export default function DestinationsPage() {
  const { lang } = useLanguage();
  const isAr = lang === "ar";

  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const res = await axios.get("/destinations");
        setDestinations(res.data.destinations || []);
      } catch {
        setDestinations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDestinations();
  }, []);

  return (
    <main dir={isAr ? "rtl" : "ltr"} className="min-h-screen bg-[#fbf7ef] px-4 py-12">
      <section className="mx-auto max-w-[1280px]">
        <div className="mb-10 text-center">
          <span className="rounded-full bg-white px-5 py-2 text-sm font-black text-[#c99b2e]">
            {isAr ? "كل الوجهات" : "All Destinations"}
          </span>

          <h1 className="mt-5 text-4xl font-black text-[#06142b]">
            {isAr ? "اكتشف وجهاتك القادمة" : "Discover Your Next Destination"}
          </h1>
        </div>

        {loading ? (
          <div className="rounded-3xl bg-white p-8 text-center font-black text-[#c99b2e]">
            {isAr ? "جاري التحميل..." : "Loading..."}
          </div>
        ) : destinations.length === 0 ? (
          <div className="rounded-3xl bg-white p-8 text-center font-black text-[#c99b2e]">
            {isAr ? "لا توجد وجهات حالياً" : "No destinations available"}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {destinations.map((destination) => (
              <article
                key={destination.id}
                className="overflow-hidden rounded-[30px] border border-[#ead7ad] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="relative h-56">
                  <img
                    src={getImageUrl(destination.image)}
                    alt={destination.name}
                    className="h-full w-full object-cover"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent" />

                  {destination.badge && (
                    <span className="absolute top-4 right-4 rounded-full bg-[#d4af37] px-3 py-1 text-xs font-black text-white">
                      {destination.badge}
                    </span>
                  )}

                  <h2 className="absolute bottom-5 right-5 text-3xl font-black text-white">
                    {destination.name}
                  </h2>
                </div>

                <div className="p-6">
                  <div className="mb-4 flex flex-wrap gap-4 text-sm font-bold text-[#667085]">
                    <span className="flex items-center gap-1">
                      <Star size={16} fill="#d4af37" className="text-[#d4af37]" />
                      {destination.rating || 4.5}
                    </span>

                    <span className="flex items-center gap-1">
                      <Clock size={16} className="text-[#d4af37]" />
                      {destination.days || 1} {isAr ? "أيام" : "days"}
                    </span>

                    {destination.location && (
                      <span className="flex items-center gap-1">
                        <MapPin size={16} className="text-[#d4af37]" />
                        {destination.location}
                      </span>
                    )}
                  </div>

                  <p className="line-clamp-3 min-h-[72px] text-sm leading-7 text-[#667085]">
                    {destination.description ||
                      (isAr
                        ? "وجهة مميزة بتفاصيل منظمة وتجربة سفر مختلفة."
                        : "A special destination with organized details.")}
                  </p>

                  <div className="mt-6 flex items-center justify-between">
                    <p className="font-black text-[#06142b]">
                      {Number(destination.price || 0).toLocaleString()}{" "}
                      {isAr ? "جنيه" : "EGP"}
                    </p>

                    <Link
                      href={`/destinations/${destination.slug}`}
                      className="rounded-full bg-[#06142b] px-5 py-2 text-sm font-black text-[#d4af37]"
                    >
                      {isAr ? "التفاصيل" : "Details"}
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
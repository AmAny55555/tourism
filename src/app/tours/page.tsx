"use client";

import Link from "next/link";
import {
  ChevronDown,
  Clock,
  MapPin,
  Search,
  Star,
  Tag,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import axios from "../../lib/axios";
import Loading from "@/app/loading";
import { useLanguage } from "@/context/language-context";

export default function ToursPage() {
  const { lang, t } = useLanguage();

  const text = t.common.toursPage;
  const isAr = lang === "ar";

  const getTripName = (trip: any) =>
    isAr ? trip.name_ar || trip.name : trip.name_en || trip.name;

  const getTripDescription = (trip: any) =>
    isAr
      ? trip.description_ar || trip.description
      : trip.description_en || trip.description;

  const getTripBadge = (trip: any) =>
    isAr ? trip.badge_ar || trip.badge : trip.badge_en || trip.badge;

  const getTripLocation = (trip: any) =>
    isAr ? trip.location_ar || trip.location : trip.location_en || trip.location;

  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState("all");
  const [selectedDestination, setSelectedDestination] = useState("all");

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const res = await axios.get("/destinations");
        setTrips(res.data.destinations || []);
      } catch (error) {
        setTrips([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);

  const getImageUrl = (image: string | null) => {
    if (!image) {
      return "https://images.pexels.com/photos/532826/pexels-photo-532826.jpeg";
    }

    if (image.startsWith("http")) {
      return image;
    }

    return `${process.env.NEXT_PUBLIC_API_URL}/storage/${image}`;
  };

  const filteredTrips = useMemo(() => {
    return trips.filter((trip) => {
      const matchesClass =
        selectedClass === "all" || trip.category === selectedClass;

      const matchesDestination =
        selectedDestination === "all" ||
        String(trip.id) === String(selectedDestination);

      return matchesClass && matchesDestination;
    });
  }, [trips, selectedClass, selectedDestination]);

  if (loading) {
    return <Loading />;
  }

  return (
    <main
      dir={isAr ? "rtl" : "ltr"}
      className="min-h-screen bg-[#fbf7ef] text-[#101827]"
    >
      <section className="relative">
        <div className="relative h-[430px] overflow-hidden rounded-b-[42px] sm:h-[520px] sm:rounded-b-[80px]">
          <img
            src="https://images.pexels.com/photos/532826/pexels-photo-532826.jpeg"
            alt={text.hero.imageAlt}
            className="absolute inset-0 h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-black/60" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-52 bg-gradient-to-t from-[#d4af37]/50 to-transparent" />

          <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center text-white sm:px-6">
            <span className="mb-5 rounded-full border border-white/25 bg-white/20 px-6 py-3 text-xs font-black backdrop-blur-md sm:text-sm">
              {text.hero.badge}
            </span>

            <h1 className="max-w-4xl text-4xl font-black leading-tight sm:text-5xl md:text-7xl">
              {text.hero.title}
            </h1>

            <p className="mt-6 max-w-2xl text-sm font-bold leading-7 text-white/90 sm:text-lg sm:leading-8">
              {text.hero.description}
            </p>
          </div>
        </div>

        <div className="relative z-20 mx-auto -mt-14 max-w-[1180px] px-4 sm:-mt-16">
          <div className="grid gap-5 rounded-[30px] border border-[#eadfca] bg-white/95 p-5 shadow-[0_30px_90px_rgba(212,175,55,0.25)] backdrop-blur-xl sm:rounded-[40px] sm:p-8 md:grid-cols-2 md:gap-8">
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-black text-slate-500">
                {text.filters.tripClass}
                <Tag size={17} className="text-[#d4af37]" />
              </label>

              <div className="relative">
                <ChevronDown
                  size={20}
                  className={`absolute top-1/2 -translate-y-1/2 text-[#d4af37] ${
                    isAr ? "left-5" : "right-5"
                  }`}
                />

                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="h-14 w-full appearance-none rounded-2xl border border-[#eadfca] bg-white px-5 text-start text-base font-black text-[#101827] outline-none transition focus:border-[#d4af37] sm:h-16 sm:text-lg"
                >
                  <option value="all">{text.filters.all}</option>
                  <option value="Economy Class">Economy Class</option>
                  <option value="Premium Economy Class">
                    Premium Economy Class
                  </option>
                  <option value="Business Class">Business Class</option>
                  <option value="First Class">First Class</option>
                </select>
              </div>
            </div>

            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-black text-slate-500">
                {text.filters.destination}
                <MapPin size={17} className="text-[#d4af37]" />
              </label>

              <div className="relative">
                <ChevronDown
                  size={20}
                  className={`absolute top-1/2 -translate-y-1/2 text-[#d4af37] ${
                    isAr ? "left-5" : "right-5"
                  }`}
                />

                <select
                  value={selectedDestination}
                  onChange={(e) => setSelectedDestination(e.target.value)}
                  className="h-14 w-full appearance-none rounded-2xl border border-[#eadfca] bg-white px-5 text-start text-base font-black text-[#101827] outline-none transition focus:border-[#d4af37] sm:h-16 sm:text-lg"
                >
                  <option value="all">{text.filters.all}</option>

                  {trips.map((trip) => (
                    <option key={trip.id} value={trip.id}>
                      {getTripName(trip)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] px-4 py-14 sm:px-6 sm:py-20">
        <div className="mb-8 flex flex-col gap-5 border-b border-[#eadfca] pb-6 sm:mb-10 sm:flex-row sm:items-center sm:justify-between sm:pb-8">
          <h2 className="flex items-center gap-3 text-2xl font-black sm:text-4xl">
            {text.section.title}
            <span className="text-4xl font-light text-[#d4af37] sm:text-5xl">
              ✧
            </span>
          </h2>

          <div className="inline-flex w-fit items-center gap-3 rounded-full bg-white px-5 py-3 shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
            <Search size={19} className="text-[#d4af37]" />
            <span className="font-black text-slate-600">
              {text.section.results}: {filteredTrips.length}
            </span>
          </div>
        </div>

        {filteredTrips.length === 0 ? (
          <div className="rounded-[28px] border border-[#eadfca] bg-[#fffdf8] p-8 text-center shadow-sm sm:rounded-[34px] sm:p-10">
            <p className="text-base font-black leading-7 text-slate-500 sm:text-lg">
              {text.empty}
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {filteredTrips.map((trip, index) => (
              <article
                key={trip.id}
                className="group overflow-hidden rounded-[30px] border border-[#eadfca] bg-white shadow-[0_20px_70px_rgba(0,0,0,0.08)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_35px_95px_rgba(212,175,55,0.22)] sm:rounded-[36px] lg:hover:-translate-y-4"
                style={{
                  animation: `cardUp 0.7s ease ${index * 0.12}s both`,
                }}
              >
                <div className="relative h-[230px] overflow-hidden sm:h-[270px]">
                  <img
                    src={getImageUrl(trip.image)}
                    alt={getTripName(trip)}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                  <div
                    className={`absolute top-4 ${
                      isAr ? "right-4" : "left-4"
                    }`}
                  >
                    <span className="rounded-full border border-white/35 bg-white/20 px-4 py-2 text-xs font-black text-white backdrop-blur-md">
                      TAUI ✦
                    </span>
                  </div>

                  <div
                    className={`absolute bottom-4 flex flex-wrap gap-2 ${
                      isAr ? "left-4" : "right-4"
                    }`}
                  >
                    {trip.price && (
                      <span className="rounded-full border border-white/40 bg-black/55 px-4 py-2 text-xs font-black text-white backdrop-blur-md sm:text-sm">
                        {Number(trip.price).toLocaleString()}{" "}
                        {text.card.currency} ✦
                      </span>
                    )}

                    {getTripBadge(trip) && (
                      <span className="rounded-full border border-white/40 bg-black/55 px-4 py-2 text-xs font-black text-white backdrop-blur-md sm:text-sm">
                        {getTripBadge(trip)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-5 text-start sm:p-6">
                  <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <span className="inline-flex w-fit items-center gap-1 rounded-full bg-[#f7f0e6] px-4 py-2 text-sm font-black text-[#8f6f2a]">
                      {trip.rating || 4.5}
                      <Star
                        size={15}
                        fill="#d4af37"
                        className="text-[#d4af37]"
                      />
                    </span>

                    <span className="flex items-center gap-1 text-sm font-bold text-slate-500">
                      <span className="break-words">
                        {getTripLocation(trip) || text.card.defaultLocation}
                      </span>
                      <MapPin size={16} className="shrink-0 text-[#d4af37]" />
                    </span>
                  </div>

                  <h3 className="break-words text-xl font-black leading-8 sm:text-2xl">
                    {getTripName(trip)}
                  </h3>

                  <p className="mt-4 min-h-[56px] text-sm font-bold leading-7 text-slate-500">
                    {getTripDescription(trip) || text.card.fallbackDescription}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {[
                      trip.category || "Economy Class",
                      text.card.internalTrip,
                      "TAUI",
                    ].map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-[#e8dfcf] bg-white px-3 py-1 text-xs font-bold text-slate-500"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <Link
                      href={`/destinations/${trip.slug}`}
                      className="inline-flex justify-center rounded-full bg-[#d4af37] px-6 py-3 text-sm font-black text-white shadow-lg shadow-[#d4af37]/25 transition hover:-translate-y-1 hover:bg-[#b8962e]"
                    >
                      {text.card.detailsButton}
                    </Link>

                    <span className="flex items-center justify-center gap-1 text-sm font-bold text-slate-500 sm:justify-start">
                      {trip.days || 1} {text.card.days}
                      <Clock size={16} className="shrink-0 text-[#d4af37]" />
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <style jsx global>{`
        @keyframes cardUp {
          from {
            opacity: 0;
            transform: translateY(55px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </main>
  );
}
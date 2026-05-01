"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { MapPinned } from "lucide-react";
import { useLanguage } from "@/context/language-context";

const destinations = [
  {
    key: "cairo",
    image:
      "https://images.pexels.com/photos/1549326/pexels-photo-1549326.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    key: "alexandria",
    image:
      "https://images.pexels.com/photos/1139556/pexels-photo-1139556.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    key: "luxor",
    image:
      "https://images.pexels.com/photos/3408744/pexels-photo-3408744.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    key: "aswan",
    image:
      "https://images.pexels.com/photos/3889855/pexels-photo-3889855.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    key: "giza",
    image:
      "https://images.pexels.com/photos/91409/pexels-photo-91409.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    key: "hurghada",
    image:
      "https://images.pexels.com/photos/457882/pexels-photo-457882.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    key: "sharm",
    image:
      "https://images.pexels.com/photos/1659438/pexels-photo-1659438.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    key: "dahab",
    image:
      "https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    key: "taba",
    image:
      "https://images.pexels.com/photos/1051075/pexels-photo-1051075.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    key: "marsaMatrouh",
    image:
      "https://images.pexels.com/photos/189349/pexels-photo-189349.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    key: "portSaid",
    image:
      "https://images.pexels.com/photos/2901209/pexels-photo-2901209.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    key: "suez",
    image:
      "https://images.pexels.com/photos/533769/pexels-photo-533769.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    key: "elGouna",
    image:
      "https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    key: "alamein",
    image:
      "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    key: "ainSokhna",
    image:
      "https://images.pexels.com/photos/753626/pexels-photo-753626.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    key: "marsaAlam",
    image:
      "https://images.pexels.com/photos/3046582/pexels-photo-3046582.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
] as const;

const featuredDestinationKeys = ["giza", "luxor", "aswan", "sharm"] as const;

const featuredDestinations = featuredDestinationKeys
  .map((key) => destinations.find((destination) => destination.key === key))
  .filter(Boolean) as typeof destinations[number][];

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.16,
      delayChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.92, y: 35 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export default function DestinationsSection() {
  const { lang, t } = useLanguage();
  const destinationsText = t.common.destinationsSection;
  const isAr = lang === "ar";

  return (
    <section
      dir={isAr ? "rtl" : "ltr"}
      className="relative overflow-hidden bg-[#f7f0e6] py-14 lg:py-20"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#d4af37]/25 to-transparent" />

      <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className={`mb-10 text-center md:mb-12 ${
            isAr ? "md:text-right" : "md:text-left"
          }`}
        >
          <span className="inline-flex rounded-full border border-[#d4af37]/25 bg-white/60 px-4 py-2 text-xs font-bold text-[#8f6f2a] shadow-sm backdrop-blur-md">
            {destinationsText.badge}
          </span>

          <h2 className="mt-5 text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
            <span className="bg-gradient-to-r from-[#8f6f2a] via-[#d4af37] to-[#f3d77b] bg-clip-text text-transparent">
              {destinationsText.title}
            </span>
          </h2>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4"
        >
          {featuredDestinations.map((destination) => {
            const destinationText =
              destinationsText.items[destination.key];

            return (
              <motion.article
                key={destination.key}
                variants={cardVariants}
                className="group relative h-[340px] overflow-hidden rounded-[28px] shadow-[0_18px_45px_rgba(0,0,0,0.08)] ring-1 ring-white/40 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(212,175,55,0.22)] sm:h-[390px]"
              >
                <Image
                  src={destination.image}
                  alt={destinationText.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent opacity-90" />

                <div className="absolute inset-0 flex flex-col justify-end p-5 sm:p-6">
                  <div className="translate-y-0 transition-transform duration-500 sm:translate-y-5 sm:group-hover:translate-y-0">
                    <div className="mb-3 flex items-center gap-2">
                      <MapPinned size={17} className="shrink-0 text-[#f3d77b]" />
                      <span className="text-xs font-bold uppercase tracking-wider text-[#f3d77b]">
                        {destinationsText.featuredLabel}
                      </span>
                    </div>

                    <h3 className="text-2xl font-bold text-white sm:text-3xl">
                      {destinationText.name}
                    </h3>

                    <p className="mt-3 text-sm leading-7 text-slate-200 opacity-100 transition-opacity delay-100 duration-500 sm:opacity-0 sm:group-hover:opacity-100">
                      {destinationText.description}
                    </p>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </motion.div>

        <div className="mt-10 text-center">
          <Link
            href="/destinations"
            className="inline-flex h-12 items-center justify-center rounded-full bg-[#d4af37] px-7 text-sm font-bold text-white shadow-[0_14px_35px_rgba(212,175,55,0.28)] transition hover:-translate-y-1 hover:bg-[#bd982c]"
          >
            {destinationsText.viewAll}
          </Link>
        </div>
      </div>
    </section>
  );
}
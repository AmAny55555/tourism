"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  Clock,
  Gift,
  MapPin,
  Plane,
  Sparkles,
  Star,
  FileText,
  CreditCard,
  Hotel,
  Car,
} from "lucide-react";
import { useAuth } from "../../context/auth-context";
import { useLanguage } from "@/context/language-context";
import axios from "../../lib/axios";

type Stats = {
  total_trips: number;
  under_review: number;
  completed_trips: number;
  points: number;
  rewards_available: number;
};

type Booking = {
  id: number;
  destination: string;
  status: string;
  trip_class: string;
  rating?: number | null;
  review?: string | null;
  design?: {
    hotel_name: string;
    transport_type: string;
    total_price: number;
    details?: string | null;
  } | null;
};

type ForeignTrip = {
  id: number;
  status: string;
  price?: number | null;
  admin_notes?: string | null;
  created_at: string;
  country?: {
    name: string;
  };
};

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const { lang, t } = useLanguage();

  const isAr = lang === "ar";
  const text = t.customer.dashboardPage;

  const [stats, setStats] = useState<Stats>({
    total_trips: 0,
    under_review: 0,
    completed_trips: 0,
    points: 0,
    rewards_available: 0,
  });

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [foreignTrips, setForeignTrips] = useState<ForeignTrip[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoadingData(true);

      const bookingsRes = await axios.get("/my-bookings");
      const foreignRes = await axios.get("/my-foreign-trip-requests");

      setStats(bookingsRes.data.stats);
      setBookings(bookingsRes.data.bookings || []);
      setForeignTrips(foreignRes.data.requests || []);
    } catch (err) {
      console.log("DASHBOARD ERROR:", err);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (!loading && !user) router.push("/auth/login");
  }, [loading, user, router]);

  useEffect(() => {
    if (user) fetchDashboardData();
  }, [user]);

  const handleRateBooking = async (booking: Booking) => {
    const Swal = (await import("sweetalert2")).default;

    const { value: formValues } = await Swal.fire({
      title: text.reviews.rateTauiExperience,
      html: `
        <div style="text-align:right; direction:rtl">
          <label style="display:block;font-weight:800;margin-bottom:8px;color:#06142b">
            ${text.reviews.rating}
          </label>

          <select id="rating" class="swal2-input" style="width:80%;border-radius:14px">
            <option value="">${text.reviews.chooseRating}</option>
            <option value="5">${text.reviews.excellent}</option>
            <option value="4">${text.reviews.veryGood}</option>
            <option value="3">${text.reviews.average}</option>
            <option value="2">${text.reviews.poor}</option>
            <option value="1">${text.reviews.bad}</option>
          </select>

          <label style="display:block;font-weight:800;margin:18px 0 8px;color:#06142b">
            ${text.reviews.tripReview}
          </label>

          <textarea
            id="review"
            class="swal2-textarea"
            placeholder="${text.reviews.reviewPlaceholder}"
            style="width:80%;min-height:120px;border-radius:14px"
          ></textarea>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: text.reviews.submitReview,
      cancelButtonText: text.reviews.cancel,
      confirmButtonColor: "#c99b2e",
      cancelButtonColor: "#06142b",
      background: "#fffaf0",
      color: "#06142b",
      preConfirm: () => {
        const rating = (document.getElementById("rating") as HTMLSelectElement)
          .value;

        const review = (document.getElementById("review") as HTMLTextAreaElement)
          .value;

        if (!rating || !review.trim()) {
          Swal.showValidationMessage(text.reviews.validation);
          return;
        }

        return { rating, review };
      },
    });

    if (!formValues) return;

    try {
      await axios.post("/reviews", {
        rating: Number(formValues.rating),
        comment: formValues.review,
        booking_id: booking.id,
      });

      await Swal.fire({
        icon: "success",
        title: text.reviews.successTitle,
        text: text.reviews.successInternal,
        confirmButtonColor: "#c99b2e",
      });

      await fetchDashboardData();
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: text.reviews.errorTitle,
        text:
          err?.response?.data?.message ||
          text.reviews.errorText,
        confirmButtonColor: "#c99b2e",
      });
    }
  };

  const handleRateForeignTrip = async (trip: ForeignTrip) => {
    const Swal = (await import("sweetalert2")).default;

    const { value: formValues } = await Swal.fire({
      title: text.reviews.rateForeignTrip,
      html: `
        <div style="text-align:right; direction:rtl">
          <label style="display:block;font-weight:800;margin-bottom:8px;color:#06142b">
            ${text.reviews.rating}
          </label>

          <select id="rating" class="swal2-input" style="width:80%;border-radius:14px">
            <option value="">${text.reviews.chooseRating}</option>
            <option value="5">${text.reviews.excellent}</option>
            <option value="4">${text.reviews.veryGood}</option>
            <option value="3">${text.reviews.average}</option>
            <option value="2">${text.reviews.poor}</option>
            <option value="1">${text.reviews.bad}</option>
          </select>

          <label style="display:block;font-weight:800;margin:18px 0 8px;color:#06142b">
            ${text.reviews.tripReview}
          </label>

          <textarea
            id="review"
            class="swal2-textarea"
            placeholder="${text.reviews.reviewPlaceholder}"
            style="width:80%;min-height:120px;border-radius:14px"
          ></textarea>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: text.reviews.submitReview,
      cancelButtonText: text.reviews.cancel,
      confirmButtonColor: "#c99b2e",
      cancelButtonColor: "#06142b",
      background: "#fffaf0",
      color: "#06142b",
      preConfirm: () => {
        const rating = (
          document.getElementById("rating") as HTMLSelectElement
        ).value;

        const review = (
          document.getElementById("review") as HTMLTextAreaElement
        ).value;

        if (!rating || !review.trim()) {
          Swal.showValidationMessage(text.reviews.validation);
          return;
        }

        return { rating, review };
      },
    });

    if (!formValues) return;

    try {
      await axios.post("/reviews", {
        rating: Number(formValues.rating),
        comment: formValues.review,
        foreign_request_id: trip.id,
      });

      await Swal.fire({
        icon: "success",
        title: text.reviews.successTitle,
        text: text.reviews.successForeign,
        confirmButtonColor: "#c99b2e",
      });

      await fetchDashboardData();
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: text.reviews.errorTitle,
        text:
          err?.response?.data?.message ||
          text.reviews.errorText,
        confirmButtonColor: "#c99b2e",
      });
    }
  };

  const totalTrips = stats.total_trips + foreignTrips.length;

  const underReview =
    stats.under_review +
    foreignTrips.filter((trip) => trip.status === "under_review").length;

  const designedForeignTrips = foreignTrips.filter(
    (trip) => trip.status === "designed"
  );

  const progress = Math.min((stats.points / 420) * 100, 100);

  if (loading || loadingData) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#fbf7ef] px-4">
        <div className="rounded-3xl border border-[#ead7ad] bg-white px-6 py-5 text-center font-black text-[#06142b] shadow-sm sm:px-8 sm:py-6">
          {text.loading}
        </div>
      </main>
    );
  }

  if (!user) return null;

  return (
    <main
      dir={isAr ? "rtl" : "ltr"}
      className="min-h-screen bg-[#fbf7ef] px-3 py-6 sm:px-6 sm:py-8 lg:px-8"
    >
      <section className="mx-auto max-w-[1400px]">
        <div className="relative mb-6 overflow-hidden rounded-[28px] border border-[#ead7ad] bg-gradient-to-l from-[#f3e7c9] via-white to-[#fffaf0] p-5 shadow-sm sm:mb-8 sm:rounded-[34px] sm:p-8 lg:p-10">
          <div className="absolute left-0 top-0 h-full w-1/2 bg-gradient-to-r from-[#c99b2e]/20 to-transparent" />

          <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#c99b2e]/30 bg-white/80 px-4 py-2 text-xs font-black text-[#c99b2e] sm:px-5 sm:text-sm">
                <Sparkles size={17} />
                {text.hero.badge}
              </span>

              <h1 className="break-words text-2xl font-black text-[#06142b] sm:text-4xl lg:text-5xl">
                {text.hero.welcome}, {user.name}
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-[#667085] sm:text-base sm:leading-8">
                {text.hero.description}
              </p>
            </div>

            <div className="w-full rounded-[24px] border border-[#ead7ad] bg-white/80 p-5 text-center shadow-sm sm:w-auto sm:rounded-[26px]">
              <Gift className="mx-auto mb-3 text-[#c99b2e]" size={28} />
              <p className="text-sm font-bold text-[#667085]">
                {text.hero.loyaltyPoints}
              </p>
              <h2 className="mt-1 text-4xl font-black text-[#06142b]">
                {stats.points}
              </h2>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={<Plane />}
            label={text.stats.totalTrips}
            value={totalTrips}
          />
          <StatCard
            icon={<Clock />}
            label={text.stats.underReview}
            value={underReview}
          />
          <StatCard
            icon={<Star />}
            label={text.stats.points}
            value={stats.points}
          />
          <StatCard
            icon={<Gift />}
            label={text.stats.rewards}
            value={stats.rewards_available}
          />
        </div>

        <div className="mt-6 grid gap-6 lg:mt-8 lg:grid-cols-[1.7fr_0.8fr]">
          <section className="rounded-[26px] border border-[#ead7ad] bg-white p-4 shadow-sm sm:rounded-[30px] sm:p-6">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-black text-[#06142b] sm:text-2xl">
                  {text.internalTrips.title}
                </h2>
                <p className="mt-1 text-sm text-[#667085] sm:text-base">
                  {text.internalTrips.subtitle}
                </p>
              </div>

              <button
                type="button"
                onClick={() => router.push("/tours")}
                className="rounded-full bg-[#c99b2e] px-6 py-3 text-sm font-black text-white transition hover:bg-[#b88a22]"
              >
                {text.internalTrips.bookButton}
              </button>
            </div>

            {bookings.length === 0 ? (
              <EmptyBox
                title={text.internalTrips.emptyTitle}
                description={text.internalTrips.emptyDescription}
              />
            ) : (
              <div className="grid gap-5">
                {bookings.map((booking) => (
                  <article
                    key={booking.id}
                    className="rounded-[26px] border border-[#ead7ad] bg-[#fcfaf6] p-4 sm:rounded-[28px] sm:p-5"
                  >
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      <StatusBadge status={booking.status} labels={text.status} />
                      <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-[#667085]">
                        #{booking.id}
                      </span>
                    </div>

                    <h3 className="text-xl font-black text-[#06142b]">
                      {booking.destination}
                    </h3>

                    <p className="mt-2 text-sm font-bold text-[#667085]">
                      {text.fields.tripClass}: {booking.trip_class}
                    </p>

                    {booking.status === "under_review" && (
                      <div className="mt-4 rounded-2xl border border-[#ead7ad] bg-white p-4 text-sm font-bold leading-7 text-[#667085]">
                        {text.reviews.availableAfterCompletion}
                      </div>
                    )}

                    {booking.status === "designed" && booking.design && (
                      <div className="mt-5 overflow-hidden rounded-[26px] border border-[#ead7ad] bg-white shadow-sm sm:rounded-[28px]">
                        <div className="border-b border-[#ead7ad] bg-gradient-to-l from-[#fffaf0] via-white to-[#f5ead2] p-5">
                          <span className="inline-flex rounded-full bg-[#f5ead2] px-4 py-2 text-xs font-black text-[#c99b2e]">
                            {text.status.designed || "تم تحديد السعر"}
                          </span>

                          <h4 className="mt-3 text-xl font-black text-[#06142b] sm:text-2xl">
                            تصميم رحلتك جاهز
                          </h4>

                          <p className="mt-2 text-sm leading-7 text-[#667085]">
                            راجعي تفاصيل الفندق والمواصلات والتكلفة، ثم أكدي الرحلة للانتقال للدفع.
                          </p>
                        </div>

                        <div className="grid gap-4 p-5 sm:grid-cols-3">
                          <PreviewCard
                            title={text.fields.hotel}
                            value={booking.design.hotel_name}
                            icon={<Hotel />}
                          />

                          <PreviewCard
                            title={text.fields.transport}
                            value={booking.design.transport_type}
                            icon={<Car />}
                          />

                          <PreviewCard
                            title={text.fields.cost}
                            value={`${Number(
                              booking.design.total_price
                            ).toLocaleString()} ${text.common.currency}`}
                            icon={<CreditCard />}
                          />
                        </div>

                        {booking.design.details && (
                          <div className="px-5 pb-5">
                            <div className="rounded-[24px] border border-[#ead7ad] bg-[#fcfaf6] p-5">
                              <p className="mb-2 text-sm font-black text-[#c99b2e]">
                                {text.fields.notes}
                              </p>
                              <p className="whitespace-pre-line break-words text-sm leading-8 text-[#667085]">
                                {booking.design.details}
                              </p>
                            </div>
                          </div>
                        )}

                        <div className="flex justify-end px-5 pb-5">
                          <button
                            type="button"
                            onClick={() => router.push(`/payment/${booking.id}`)}
                            className="rounded-full bg-[#c99b2e] px-7 py-3 text-sm font-black text-white shadow-lg shadow-[#c99b2e]/25 transition hover:-translate-y-1 hover:bg-[#b88a22]"
                          >
                            تأكيد الرحلة والانتقال للدفع
                          </button>
                        </div>
                      </div>
                    )}

                    {booking.status === "designed" && !booking.design && (
                      <div className="mt-4 rounded-2xl border border-[#ead7ad] bg-white p-4 text-sm font-bold leading-7 text-[#667085]">
                        تم تحديد السعر، لكن تفاصيل التصميم لم تصل بعد. حدّثي الصفحة أو راجعي الإدارة.
                      </div>
                    )}

                    {booking.status === "completed" && !booking.rating && (
                      <button
                        type="button"
                        onClick={() => handleRateBooking(booking)}
                        className="mt-4 rounded-full bg-[#06142b] px-5 py-2 text-sm font-black text-white transition hover:bg-[#0d2446]"
                      >
                        ⭐ {text.reviews.rateTrip}
                      </button>
                    )}

                    {booking.status === "completed" && booking.rating && (
                      <div className="mt-4 rounded-2xl border border-green-200 bg-green-50 p-4">
                        <p className="text-sm font-black text-green-700">
                          ✅ {text.reviews.reviewed}
                        </p>

                        <div className="mt-2 flex gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              size={18}
                              className={
                                star <= Number(booking.rating)
                                  ? "fill-[#c99b2e] text-[#c99b2e]"
                                  : "text-gray-300"
                              }
                            />
                          ))}
                        </div>

                        {booking.review && (
                          <p className="mt-2 text-sm font-bold leading-7 text-[#667085]">
                            {booking.review}
                          </p>
                        )}
                      </div>
                    )}
                  </article>
                ))}
              </div>
            )}
          </section>

          <aside className="space-y-6">
            <div className="rounded-[26px] border border-[#ead7ad] bg-white p-5 shadow-sm sm:rounded-[30px] sm:p-6">
              <h2 className="text-xl font-black text-[#06142b] sm:text-2xl">
                {text.loyalty.title}
              </h2>

              <p className="mt-2 text-sm leading-7 text-[#667085]">
                {text.loyalty.description}
              </p>

              <div className="mt-8">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <span className="text-sm font-black text-[#c99b2e]">
                    {stats.points} / 420 {text.common.point}
                  </span>
                  <span className="text-sm font-black text-[#06142b]">
                    {progress.toFixed(0)}%
                  </span>
                </div>

                <div className="h-4 overflow-hidden rounded-full bg-[#ece8df]">
                  <div
                    className="h-full rounded-full bg-[#c99b2e] transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="rounded-[26px] border border-[#ead7ad] bg-white p-5 shadow-sm sm:rounded-[30px] sm:p-6">
              <h2 className="text-xl font-black text-[#06142b] sm:text-2xl">
                {text.updates.title}
              </h2>

              <div className="mt-5 rounded-[24px] bg-[#fcfaf6] p-5">
                <h3 className="font-black text-[#06142b]">
                  {designedForeignTrips.length > 0
                    ? text.updates.foreignPriceTitle
                    : totalTrips > 0
                    ? text.updates.requestReceivedTitle
                    : text.updates.noNotificationsTitle}
                </h3>

                <p className="mt-1 text-sm leading-7 text-[#667085]">
                  {designedForeignTrips.length > 0
                    ? text.updates.foreignPriceDescription
                    : text.updates.defaultDescription}
                </p>
              </div>
            </div>
          </aside>
        </div>

        <section className="mt-6 rounded-[26px] border border-[#ead7ad] bg-white p-4 shadow-sm sm:rounded-[30px] sm:p-6">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-black text-[#06142b] sm:text-2xl">
                {text.foreignTrips.title}
              </h2>
              <p className="mt-1 text-sm text-[#667085] sm:text-base">
                {text.foreignTrips.subtitle}
              </p>
            </div>

            <button
              type="button"
              onClick={() => router.push("/outbound")}
              className="rounded-full bg-[#c99b2e] px-6 py-3 text-sm font-black text-white transition hover:bg-[#b88a22]"
            >
              {text.foreignTrips.newRequestButton}
            </button>
          </div>

          {foreignTrips.length === 0 ? (
            <EmptyBox
              title={text.foreignTrips.emptyTitle}
              description={text.foreignTrips.emptyDescription}
              icon={<FileText size={30} />}
            />
          ) : (
            <div className="grid gap-4 xl:grid-cols-2">
              {foreignTrips.map((trip) => (
                <article
                  key={trip.id}
                  className="rounded-[26px] border border-[#ead7ad] bg-[#fcfaf6] p-4 transition hover:-translate-y-1 hover:shadow-md sm:rounded-[28px] sm:p-5"
                >
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <StatusBadge status={trip.status} labels={text.status} />
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-[#667085]">
                      #{trip.id}
                    </span>
                  </div>

                  <h3 className="break-words text-xl font-black text-[#06142b] sm:text-2xl">
                    {text.foreignTrips.travelTo}{" "}
                    {trip.country?.name || text.common.unknownCountry}
                  </h3>

                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <InfoItem
                      icon={<CalendarDays />}
                      label={text.fields.requestDate}
                      value={new Date(trip.created_at).toLocaleDateString(
                        isAr ? "ar-EG" : "en-US"
                      )}
                    />

                    <InfoItem
                      icon={<Clock />}
                      label={text.fields.status}
                      value={getStatusLabel(trip.status, text.status)}
                    />
                  </div>

                  {["completed", "confirmed", "approved"].includes(trip.status) && (
                    <button
                      type="button"
                      onClick={() => handleRateForeignTrip(trip)}
                      className="mt-4 rounded-full bg-[#06142b] px-5 py-2 text-white"
                    >
                      ⭐ {text.reviews.rateTrip}
                    </button>
                  )}

                  {trip.status === "designed" && trip.price && (
                    <div className="mt-5 overflow-hidden rounded-[26px] border border-[#ead7ad] bg-white shadow-sm sm:rounded-[28px]">
                      <div className="border-b border-[#ead7ad] bg-gradient-to-l from-[#fffaf0] via-white to-[#f5ead2] p-5">
                        <span className="inline-flex rounded-full bg-[#f5ead2] px-4 py-2 text-xs font-black text-[#c99b2e]">
                          {text.foreignTrips.priceSetBadge}
                        </span>

                        <h4 className="mt-3 text-xl font-black text-[#06142b] sm:text-2xl">
                          {text.foreignTrips.offerTitle}
                        </h4>

                        <p className="mt-2 text-sm leading-7 text-[#667085]">
                          {text.foreignTrips.offerDescription}
                        </p>
                      </div>

                      <div className="grid gap-4 p-5 sm:grid-cols-2">
                        <PreviewCard
                          title={text.fields.cost}
                          value={`${Number(trip.price).toLocaleString()} ${
                            text.common.currency
                          }`}
                          icon={<CreditCard />}
                        />

                        <PreviewCard
                          title={text.fields.country}
                          value={trip.country?.name || text.common.unknown}
                          icon={<MapPin />}
                        />
                      </div>

                      {trip.admin_notes && (
                        <div className="px-5 pb-5">
                          <div className="rounded-[24px] border border-[#ead7ad] bg-[#fcfaf6] p-5">
                            <p className="mb-2 text-sm font-black text-[#c99b2e]">
                              {text.fields.adminNotes}
                            </p>
                            <p className="whitespace-pre-line break-words text-sm leading-8 text-[#667085]">
                              {trip.admin_notes}
                            </p>
                          </div>
                        </div>
                      )}

                      <div className="flex justify-end px-5 pb-5">
                        <button
                          type="button"
                          onClick={() =>
                            router.push(`/foreign-payment/${trip.id}`)
                          }
                          className="rounded-full bg-[#c99b2e] px-7 py-3 text-sm font-black text-white shadow-lg shadow-[#c99b2e]/25 transition hover:-translate-y-1 hover:bg-[#b88a22]"
                        >
                          {text.foreignTrips.payButton}
                        </button>
                      </div>
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-[24px] border border-[#ead7ad] bg-white p-5 shadow-sm sm:rounded-[26px]">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f5ead2] text-[#c99b2e] [&>svg]:h-6 [&>svg]:w-6">
        {icon}
      </div>
      <p className="text-sm font-bold text-[#667085]">{label}</p>
      <h3 className="mt-2 text-3xl font-black text-[#06142b] sm:text-4xl">
        {value}
      </h3>
    </div>
  );
}

function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-[18px] border border-[#ead7ad] bg-white p-3">
      <div className="mb-2 flex items-center gap-2 text-[#c99b2e]">
        <span className="[&>svg]:h-4 [&>svg]:w-4">{icon}</span>
        <span className="text-xs font-black">{label}</span>
      </div>
      <p className="break-words text-sm font-bold text-[#06142b]">{value}</p>
    </div>
  );
}

function PreviewCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-[24px] border border-[#ead7ad] bg-[#fcfaf6] p-5">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#c99b2e] shadow-sm [&>svg]:h-6 [&>svg]:w-6">
        {icon}
      </div>
      <p className="text-xs font-black text-[#c99b2e]">{title}</p>
      <p className="mt-2 break-words text-base font-black leading-7 text-[#06142b]">
        {value}
      </p>
    </div>
  );
}

function EmptyBox({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="rounded-[24px] border border-dashed border-[#d8c69c] bg-[#fcfaf6] p-8 text-center">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#f5ead2] text-[#c99b2e]">
        {icon || <MapPin size={30} />}
      </div>
      <h3 className="text-xl font-black text-[#06142b]">{title}</h3>
      <p className="mx-auto mt-2 max-w-md leading-7 text-[#667085]">
        {description}
      </p>
    </div>
  );
}

function getStatusLabel(status: string, labels: Record<string, string>) {
  return labels[status] || status;
}

function StatusBadge({
  status,
  labels,
}: {
  status: string;
  labels: Record<string, string>;
}) {
  const styles: Record<string, string> = {
    under_review: "bg-yellow-100 text-yellow-700",
    designed: "bg-blue-100 text-blue-700",
    confirmed: "bg-green-100 text-green-700",
    completed: "bg-slate-200 text-slate-700",
    cancelled: "bg-red-100 text-red-700",
    rejected: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`rounded-full px-4 py-2 text-xs font-black ${
        styles[status] || "bg-[#f5ead2] text-[#c99b2e]"
      }`}
    >
      {getStatusLabel(status, labels)}
    </span>
  );
}
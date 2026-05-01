"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "../../lib/axios";
import Swal from "sweetalert2";
import { useAuth } from "../../context/auth-context";
import { useLanguage } from "@/context/language-context";
import {
  DollarSign,
  FileText,
  LayoutDashboard,
  Pencil,
  Sparkles,
  User,
  Hotel,
  Car,
} from "lucide-react";

type Booking = {
  id: number;
  destination: string;
  status?: string;
  user?: {
    name: string;
    email: string;
  };
  design?: {
    hotel_name: string;
    transport_type: string;
    total_price: number;
    details?: string | null;
  } | null;
};

type ForeignRequest = {
  id: number;
  status: string;
  price?: number | null;
  admin_notes?: string | null;
  user?: {
    name: string;
    email: string;
  };
  country?: {
    name: string;
  };
  answers?: {
    id: number;
    value: string;
    field?: {
      label: string;
      type: string;
    };
  }[];
};

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { lang, t } = useLanguage();

  const text = t.admin.dashboardPage;
  const isAr = lang === "ar";

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [foreignRequests, setForeignRequests] = useState<ForeignRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingInternal, setSavingInternal] = useState(false);
  const [savingForeign, setSavingForeign] = useState(false);

  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [bookingForm, setBookingForm] = useState({
    hotel_name: "",
    transport_type: "",
    total_price: "",
    details: "",
  });

  const [selectedForeign, setSelectedForeign] =
    useState<ForeignRequest | null>(null);

  const [foreignForm, setForeignForm] = useState({
    price: "",
    admin_notes: "",
  });

  const fetchBookings = async () => {
    try {
      setLoading(true);

      const res = await axios.get("/admin/bookings");
      setBookings(res.data.bookings || []);

      const res2 = await axios.get("/admin/foreign-trip-requests");
      setForeignRequests(res2.data.requests || []);
    } catch (err: any) {
      console.log("ADMIN ERROR:", err);

      if (err.response?.status === 401) {
        router.replace("/auth/login");
        return;
      }

      if (err.response?.status === 403) {
        router.replace("/");
        return;
      }

      Swal.fire({
        icon: "error",
        title: text.alerts.errorTitle,
        text: text.alerts.loadError,
        confirmButtonColor: "#c99b2e",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.replace("/auth/login");
      return;
    }

    if (user.role !== "admin") {
      router.replace("/");
      return;
    }

    fetchBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, user, router]);

  const handleDesignBooking = async () => {
    if (!selectedBooking) return;

    if (
      !bookingForm.hotel_name ||
      !bookingForm.transport_type ||
      !bookingForm.total_price
    ) {
      Swal.fire({
        icon: "warning",
        title: text.internalModal.validationTitle,
        text: text.internalModal.validationText,
        confirmButtonColor: "#c99b2e",
      });
      return;
    }

    try {
      setSavingInternal(true);

      await axios.post(`/admin/bookings/${selectedBooking.id}/design`, {
        hotel_name: bookingForm.hotel_name,
        transport_type: bookingForm.transport_type,
        total_price: bookingForm.total_price,
        details: bookingForm.details,
      });

      await Swal.fire({
        icon: "success",
        title: text.internalModal.successTitle,
        text: text.internalModal.successText,
        confirmButtonColor: "#c99b2e",
      });

      setSelectedBooking(null);
      setBookingForm({
        hotel_name: "",
        transport_type: "",
        total_price: "",
        details: "",
      });

      fetchBookings();
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: text.alerts.errorTitle,
        text: err.response?.data?.message || text.internalModal.errorText,
        confirmButtonColor: "#c99b2e",
      });
    } finally {
      setSavingInternal(false);
    }
  };

  const handleDesignForeign = async () => {
    if (!selectedForeign) return;

    if (!foreignForm.price) {
      Swal.fire({
        icon: "warning",
        title: text.foreignModal.validationTitle,
        confirmButtonColor: "#c99b2e",
      });
      return;
    }

    try {
      setSavingForeign(true);

      await axios.post(
        `/admin/foreign-trip-requests/${selectedForeign.id}/design`,
        {
          price: foreignForm.price,
          admin_notes: foreignForm.admin_notes,
        }
      );

      await Swal.fire({
        icon: "success",
        title: text.foreignModal.successTitle,
        text: text.foreignModal.successText,
        confirmButtonColor: "#c99b2e",
      });

      setSelectedForeign(null);
      setForeignForm({ price: "", admin_notes: "" });
      fetchBookings();
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: text.alerts.errorTitle,
        text: err.response?.data?.message || text.foreignModal.errorText,
        confirmButtonColor: "#c99b2e",
      });
    } finally {
      setSavingForeign(false);
    }
  };

  if (authLoading || loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#fbf7ef] px-4">
        <div className="rounded-3xl border border-[#ead7ad] bg-white px-6 py-5 text-center font-black text-[#06142b] shadow-sm sm:px-8 sm:py-6">
          {text.loading}
        </div>
      </main>
    );
  }

  if (!user || user.role !== "admin") {
    return null;
  }

  return (
    <main
      dir={isAr ? "rtl" : "ltr"}
      className="min-h-screen bg-[#fbf7ef] px-3 py-6 sm:px-6 sm:py-8 lg:px-8"
    >
      <section className="mx-auto max-w-[1400px]">
        <div className="relative mb-6 overflow-hidden rounded-[28px] border border-[#ead7ad] bg-gradient-to-l from-[#f3e7c9] via-white to-[#fffaf0] p-5 shadow-sm sm:mb-8 sm:rounded-[34px] sm:p-8 lg:p-10">
          <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#c99b2e]/30 bg-white/80 px-4 py-2 text-xs font-black text-[#c99b2e] sm:px-5 sm:text-sm">
                <LayoutDashboard size={17} />
                {text.hero.badge}
              </span>

              <h1 className="text-2xl font-black text-[#06142b] sm:text-4xl lg:text-5xl">
                {text.hero.title}
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-[#667085] sm:text-base sm:leading-8">
                {text.hero.description}
              </p>
            </div>

            <div className="w-full rounded-[24px] border border-[#ead7ad] bg-white/80 p-5 text-center shadow-sm sm:w-auto sm:rounded-[26px]">
              <Sparkles className="mx-auto mb-3 text-[#c99b2e]" size={28} />
              <p className="text-sm font-bold text-[#667085]">
                {text.hero.totalRequests}
              </p>
              <h2 className="mt-1 text-4xl font-black text-[#06142b]">
                {bookings.length + foreignRequests.length}
              </h2>
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <StatCard label={text.stats.internalRequests} value={bookings.length} />
          <StatCard
            label={text.stats.foreignRequests}
            value={foreignRequests.length}
          />
        </div>

        <section className="mt-8 rounded-[26px] border border-[#ead7ad] bg-white p-4 shadow-sm sm:rounded-[30px] sm:p-6">
          <h2 className="text-xl font-black text-[#06142b] sm:text-2xl">
            {text.internalRequests.title}
          </h2>

          {bookings.length === 0 ? (
            <EmptyState text={text.internalRequests.empty} />
          ) : (
            <div className="mt-6 grid gap-5 xl:grid-cols-2">
              {bookings.map((booking) => (
                <article
                  key={booking.id}
                  className="rounded-[26px] border border-[#ead7ad] bg-[#fcfaf6] p-4 transition hover:-translate-y-1 hover:shadow-md sm:rounded-[28px] sm:p-5"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <div className="mb-3 flex flex-wrap items-center gap-2">
                        <StatusBadge
                          status={booking.status || "under_review"}
                          labels={text.status}
                        />
                        <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-[#667085]">
                          #{booking.id}
                        </span>
                      </div>

                      <h3 className="break-words text-xl font-black text-[#06142b] sm:text-2xl">
                        {booking.destination || text.common.unknownTrip}
                      </h3>

                      <p className="mt-2 flex items-start gap-2 text-sm font-bold text-[#667085]">
                        <User
                          size={16}
                          className="mt-0.5 shrink-0 text-[#c99b2e]"
                        />
                        <span className="break-words">
                          {booking.user?.name || text.common.unknown} -{" "}
                          <span className="break-all">
                            {booking.user?.email || text.common.noEmail}
                          </span>
                        </span>
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedBooking(booking);
                        setBookingForm({
                          hotel_name: booking.design?.hotel_name || "",
                          transport_type: booking.design?.transport_type || "",
                          total_price:
                            booking.design?.total_price?.toString() || "",
                          details: booking.design?.details || "",
                        });
                      }}
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-[#c99b2e] px-5 py-3 text-sm font-black text-white transition hover:bg-[#b88a22]"
                    >
                      <Pencil size={16} />
                      {booking.design
                        ? text.internalRequests.editPrice
                        : text.internalRequests.setPrice}
                    </button>
                  </div>

                  {booking.design && (
                    <div className="mt-4 rounded-[20px] border border-[#ead7ad] bg-white p-4">
                      <InfoLine
                        icon={<Hotel size={16} />}
                        label={text.fields.hotel}
                        value={booking.design.hotel_name}
                      />

                      <InfoLine
                        icon={<Car size={16} />}
                        label={text.fields.transport}
                        value={booking.design.transport_type}
                      />

                      <InfoLine
                        icon={<DollarSign size={16} />}
                        label={text.fields.selectedPrice}
                        value={`${Number(
                          booking.design.total_price
                        ).toLocaleString()} ${text.common.currency}`}
                      />

                      {booking.design.details && (
                        <p className="mt-3 break-words text-sm leading-7 text-[#667085]">
                          {booking.design.details}
                        </p>
                      )}
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="mt-8 rounded-[26px] border border-[#ead7ad] bg-white p-4 shadow-sm sm:rounded-[30px] sm:p-6">
          <h2 className="text-xl font-black text-[#06142b] sm:text-2xl">
            {text.foreignRequests.title}
          </h2>

          {foreignRequests.length === 0 ? (
            <EmptyState text={text.foreignRequests.empty} />
          ) : (
            <div className="mt-6 grid gap-5 xl:grid-cols-2">
              {foreignRequests.map((req) => (
                <article
                  key={req.id}
                  className="rounded-[26px] border border-[#ead7ad] bg-[#fcfaf6] p-4 transition hover:-translate-y-1 hover:shadow-md sm:rounded-[28px] sm:p-5"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <div className="mb-3 flex flex-wrap items-center gap-2">
                        <StatusBadge status={req.status} labels={text.status} />
                        <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-[#667085]">
                          #{req.id}
                        </span>
                      </div>

                      <h3 className="break-words text-xl font-black text-[#06142b] sm:text-2xl">
                        {text.foreignRequests.travelTo}{" "}
                        {req.country?.name || text.common.unknownCountry}
                      </h3>

                      <p className="mt-2 flex items-start gap-2 text-sm font-bold text-[#667085]">
                        <User
                          size={16}
                          className="mt-0.5 shrink-0 text-[#c99b2e]"
                        />
                        <span className="break-words">
                          {req.user?.name || text.common.unknown} -{" "}
                          <span className="break-all">
                            {req.user?.email || text.common.noEmail}
                          </span>
                        </span>
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedForeign(req);
                        setForeignForm({
                          price: req.price?.toString() || "",
                          admin_notes: req.admin_notes || "",
                        });
                      }}
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-[#c99b2e] px-5 py-3 text-sm font-black text-white transition hover:bg-[#b88a22]"
                    >
                      <Pencil size={16} />
                      {req.price
                        ? text.foreignRequests.editPrice
                        : text.foreignRequests.setPrice}
                    </button>
                  </div>

                  {req.price && (
                    <div className="mt-4 rounded-[20px] border border-[#ead7ad] bg-white p-4">
                      <InfoLine
                        icon={<DollarSign size={16} />}
                        label={text.fields.selectedPrice}
                        value={`${Number(req.price).toLocaleString()} ${
                          text.common.currency
                        }`}
                      />

                      {req.admin_notes && (
                        <p className="mt-3 break-words text-sm leading-7 text-[#667085]">
                          {req.admin_notes}
                        </p>
                      )}
                    </div>
                  )}

                  <div className="mt-5 rounded-[22px] border border-[#ead7ad] bg-white p-4">
                    <p className="mb-3 flex items-center gap-2 text-sm font-black text-[#06142b]">
                      <FileText size={16} className="text-[#c99b2e]" />
                      {text.foreignRequests.customerData}
                    </p>

                    <div className="space-y-2">
                      {req.answers?.map((ans) => (
                        <div
                          key={ans.id}
                          className="rounded-2xl bg-[#fcfaf6] px-4 py-3 text-sm"
                        >
                          <span className="font-black text-[#06142b]">
                            {ans.field?.label || text.common.field}:{" "}
                          </span>

                          {ans.field?.type === "file" ? (
                            <a
                              href={`http://localhost:8000/storage/${ans.value}`}
                              target="_blank"
                              rel="noreferrer"
                              className="font-bold text-blue-600 underline"
                            >
                              {text.foreignRequests.viewFile}
                            </a>
                          ) : (
                            <span className="break-words font-bold text-[#667085]">
                              {ans.value}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </section>

      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
          <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-[28px] border border-[#ead7ad] bg-[#fffaf0] p-5 shadow-2xl sm:rounded-[34px] sm:p-7">
            <div className="mb-6 rounded-[24px] border border-[#ead7ad] bg-white p-5 sm:rounded-[28px]">
              <span className="mb-3 inline-flex rounded-full bg-[#f5ead2] px-4 py-2 text-xs font-black text-[#c99b2e]">
                {text.internalModal.badge}
              </span>

              <h2 className="break-words text-2xl font-black text-[#06142b] sm:text-3xl">
                {selectedBooking.destination}
              </h2>

              <p className="mt-2 break-words text-sm font-bold text-[#667085]">
                {text.common.customer}:{" "}
                {selectedBooking.user?.name || text.common.unknown} -{" "}
                <span className="break-all">
                  {selectedBooking.user?.email || text.common.noEmail}
                </span>
              </p>
            </div>

            <div className="grid gap-4">
              <FormField
                label={text.fields.hotel}
                value={bookingForm.hotel_name}
                onChange={(value) =>
                  setBookingForm({
                    ...bookingForm,
                    hotel_name: value,
                  })
                }
                placeholder={text.internalModal.hotelPlaceholder}
              />

              <FormField
                label={text.fields.transport}
                value={bookingForm.transport_type}
                onChange={(value) =>
                  setBookingForm({
                    ...bookingForm,
                    transport_type: value,
                  })
                }
                placeholder={text.internalModal.transportPlaceholder}
              />

              <FormField
                label={text.fields.tripCost}
                value={bookingForm.total_price}
                onChange={(value) =>
                  setBookingForm({
                    ...bookingForm,
                    total_price: value,
                  })
                }
                placeholder="4500"
                type="number"
              />

              <div>
                <label className="mb-2 block text-sm font-black text-[#06142b]">
                  {text.fields.tripDetails}
                </label>
                <textarea
                  value={bookingForm.details}
                  onChange={(e) =>
                    setBookingForm({
                      ...bookingForm,
                      details: e.target.value,
                    })
                  }
                  placeholder={text.internalModal.detailsPlaceholder}
                  className="min-h-[150px] w-full resize-none rounded-2xl border border-[#ead7ad] bg-white px-5 py-4 leading-8 outline-none focus:border-[#c99b2e] sm:min-h-[160px]"
                />
              </div>
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setSelectedBooking(null)}
                disabled={savingInternal}
                className="rounded-full border border-[#ead7ad] bg-white px-7 py-3 font-black text-[#06142b] transition hover:bg-[#fcfaf6] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {text.common.cancel}
              </button>

              <button
                type="button"
                onClick={handleDesignBooking}
                disabled={savingInternal}
                className="rounded-full bg-[#c99b2e] px-8 py-3 font-black text-white shadow-lg shadow-[#c99b2e]/25 transition hover:-translate-y-1 hover:bg-[#b88a22] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {savingInternal ? text.common.saving : text.common.saveAndSend}
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedForeign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
          <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-[28px] border border-[#ead7ad] bg-[#fffaf0] p-5 shadow-2xl sm:rounded-[34px] sm:p-7">
            <div className="mb-6 rounded-[24px] border border-[#ead7ad] bg-white p-5 sm:rounded-[28px]">
              <span className="mb-3 inline-flex rounded-full bg-[#f5ead2] px-4 py-2 text-xs font-black text-[#c99b2e]">
                {text.foreignModal.badge}
              </span>

              <h2 className="break-words text-2xl font-black text-[#06142b] sm:text-3xl">
                {selectedForeign.country?.name || text.common.unknownCountry}
              </h2>

              <p className="mt-2 break-words text-sm font-bold text-[#667085]">
                {text.common.customer}:{" "}
                {selectedForeign.user?.name || text.common.unknown} -{" "}
                <span className="break-all">
                  {selectedForeign.user?.email || text.common.noEmail}
                </span>
              </p>
            </div>

            <div className="grid gap-4">
              <FormField
                label={text.fields.requestCost}
                value={foreignForm.price}
                onChange={(value) =>
                  setForeignForm({ ...foreignForm, price: value })
                }
                placeholder="35000"
                type="number"
              />

              <div>
                <label className="mb-2 block text-sm font-black text-[#06142b]">
                  {text.fields.customerNotes}
                </label>
                <textarea
                  value={foreignForm.admin_notes}
                  onChange={(e) =>
                    setForeignForm({
                      ...foreignForm,
                      admin_notes: e.target.value,
                    })
                  }
                  placeholder={text.foreignModal.notesPlaceholder}
                  className="min-h-[150px] w-full resize-none rounded-2xl border border-[#ead7ad] bg-white px-5 py-4 leading-8 outline-none focus:border-[#c99b2e] sm:min-h-[160px]"
                />
              </div>
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setSelectedForeign(null)}
                disabled={savingForeign}
                className="rounded-full border border-[#ead7ad] bg-white px-7 py-3 font-black text-[#06142b] transition hover:bg-[#fcfaf6] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {text.common.cancel}
              </button>

              <button
                type="button"
                onClick={handleDesignForeign}
                disabled={savingForeign}
                className="rounded-full bg-[#c99b2e] px-8 py-3 font-black text-white shadow-lg shadow-[#c99b2e]/25 transition hover:-translate-y-1 hover:bg-[#b88a22] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {savingForeign ? text.common.saving : text.common.saveAndSend}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-[24px] border border-[#ead7ad] bg-white p-5 shadow-sm sm:rounded-[26px]">
      <p className="text-sm font-bold text-[#667085]">{label}</p>
      <h3 className="mt-2 text-4xl font-black text-[#06142b]">{value}</h3>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="mt-6 rounded-[24px] border border-dashed border-[#d8c69c] bg-[#fcfaf6] p-8 text-center sm:p-10">
      <p className="text-lg font-black text-[#06142b]">{text}</p>
    </div>
  );
}

function InfoLine({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) {
  return (
    <p className="mt-2 flex items-start gap-2 text-sm font-black text-[#06142b] first:mt-0">
      <span className="mt-0.5 shrink-0 text-[#c99b2e]">{icon}</span>
      <span className="break-words">
        {label}: {value}
      </span>
    </p>
  );
}

function FormField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-black text-[#06142b]">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-14 w-full rounded-2xl border border-[#ead7ad] bg-white px-5 outline-none focus:border-[#c99b2e]"
      />
    </div>
  );
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
      {labels[status] || status}
    </span>
  );
}
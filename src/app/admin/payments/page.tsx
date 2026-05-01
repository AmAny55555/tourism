"use client";

import { useEffect, useState } from "react";
import axios from "../../../lib/axios";
import Swal from "sweetalert2";
import {
  CheckCircle,
  CreditCard,
  Hotel,
  Mail,
  Phone,
  RefreshCcw,
  User,
  XCircle,
  Wallet,
  Car,
  Plane,
  MapPin,
  CalendarDays,
  Clock,
  Users,
  Crown,
  MessageSquare,
} from "lucide-react";
import { useLanguage } from "@/context/language-context";

type Booking = {
  id: number;
  destination: string;
  status: string;
  travel_date: string;
  days_count: number;
  adults_count: number;
  children_count: number;
  trip_class: string;
  notes?: string | null;
  user?: { name: string; email: string };
  design?: {
    hotel_name: string;
    transport_type: string;
    total_price: number;
    details?: string | null;
  } | null;
};

type Payment = {
  id: number;
  method: string;
  status: string;
  transaction_reference?: string | null;
  notes?: string | null;
  user?: { name: string; email: string };
  booking?: {
    id: number;
    destination: string;
    status: string;
    design?: {
      hotel_name: string;
      transport_type: string;
      total_price: number;
      details: string;
    } | null;
  };
};

type ForeignPayment = {
  id: number;
  method: string;
  status: string;
  transaction_reference: string;
  notes?: string | null;
  amount: number;
  request?: {
    id: number;
    status: string;
    country?: { name: string };
    user?: { name: string; email: string };
  };
};

type ActionState = {
  type:
    | "design"
    | "approve-internal"
    | "reject-internal"
    | "approve-foreign"
    | "reject-foreign"
    | "refresh"
    | null;
  id: number | null;
};

export default function AdminPaymentsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [foreignPayments, setForeignPayments] = useState<ForeignPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [action, setAction] = useState<ActionState>({ type: null, id: null });

  const { lang, t } = useLanguage();
  const isAr = lang === "ar";
  const text = t.admin.paymentsPage;

  const isProcessing = (type: ActionState["type"], id?: number) => {
    if (!action.type) return false;
    if (id === undefined) return action.type === type;
    return action.type === type && action.id === id;
  };

  const fetchPayments = async () => {
    try {
      setAction({ type: "refresh", id: null });
      setLoading(true);

      const bookingsRes = await axios.get("/admin/bookings");
      setBookings(bookingsRes.data.bookings || []);

      const res = await axios.get("/admin/payments");
      setPayments(res.data.payments || []);

      const foreignRes = await axios.get("/admin/foreign-payments");
      setForeignPayments(foreignRes.data.payments || []);
    } catch (err) {
      console.log("ADMIN DATA ERROR:", err);

      Swal.fire({
        icon: "error",
        title: text.alerts.errorTitle,
        text: text.alerts.loadError,
        confirmButtonColor: "#c99b2e",
      });
    } finally {
      setLoading(false);
      setAction({ type: null, id: null });
    }
  };

  useEffect(() => {
    fetchPayments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
const designBooking = async (bookingId: number) => {
  const { value: formValues } = await Swal.fire({
    title: text.designModal.title,
    html: `
      <div style="text-align:right; direction:rtl">
        <label style="display:block;font-weight:800;margin-bottom:8px;color:#06142b">
          ${text.fields.hotel}
        </label>

        <input
          id="hotel_name"
          class="swal2-input"
          placeholder="${text.designModal.hotelPlaceholder}"
          style="width:80%;border-radius:14px"
        />

        <label style="display:block;font-weight:800;margin:18px 0 8px;color:#06142b">
          ${text.fields.transport}
        </label>

        <input
          id="transport_type"
          class="swal2-input"
          placeholder="${text.designModal.transportPlaceholder}"
          style="width:80%;border-radius:14px"
        />

        <label style="display:block;font-weight:800;margin:18px 0 8px;color:#06142b">
          ${text.fields.cost}
        </label>

        <input
          id="total_price"
          type="number"
          class="swal2-input"
          placeholder="${text.designModal.pricePlaceholder}"
          style="width:80%;border-radius:14px"
        />

        <label style="display:block;font-weight:800;margin:18px 0 8px;color:#06142b">
          ${text.fields.tripDetails}
        </label>

        <textarea
          id="details"
          class="swal2-textarea"
          placeholder="${text.designModal.detailsPlaceholder}"
          style="width:80%;min-height:120px;border-radius:14px"
        ></textarea>
      </div>
    `,
    showCancelButton: true,
    confirmButtonText: text.designModal.confirm,
    cancelButtonText: text.common.cancel,
    confirmButtonColor: "#c99b2e",
    cancelButtonColor: "#06142b",
    background: "#fffaf0",
    color: "#06142b",
    preConfirm: () => {
      const hotel_name = (
        document.getElementById("hotel_name") as HTMLInputElement
      ).value;

      const transport_type = (
        document.getElementById("transport_type") as HTMLInputElement
      ).value;

      const total_price = (
        document.getElementById("total_price") as HTMLInputElement
      ).value;

      const details = (
        document.getElementById("details") as HTMLTextAreaElement
      ).value;

      if (!hotel_name.trim() || !transport_type.trim() || !total_price) {
        Swal.showValidationMessage(text.designModal.validation);
        return;
      }

      return {
        hotel_name,
        transport_type,
        total_price: Number(total_price),
        details,
      };
    },
  });

  if (!formValues) return;

  try {
    setAction({ type: "design", id: bookingId });

    await axios.post(`/admin/bookings/${bookingId}/design`, formValues);

    await Swal.fire({
      icon: "success",
      title: text.designModal.successTitle,
      text: text.designModal.successText,
      confirmButtonColor: "#c99b2e",
    });

    fetchPayments();
  } catch (err: any) {
    Swal.fire({
      icon: "error",
      title: text.alerts.errorTitle,
      text: err.response?.data?.message || text.designModal.errorText,
      confirmButtonColor: "#c99b2e",
    });
  } finally {
    setAction({ type: null, id: null });
  }
};

  const approvePayment = async (paymentId: number) => {
    const result = await Swal.fire({
      icon: "question",
      title: text.internalPayment.approveConfirmTitle,
      text: text.internalPayment.approveConfirmText,
      showCancelButton: true,
      confirmButtonText: text.internalPayment.approveConfirmButton,
      cancelButtonText: text.common.cancel,
      confirmButtonColor: "#c99b2e",
      background: "#fffaf0",
      color: "#06142b",
    });

    if (!result.isConfirmed) return;

    try {
      setAction({ type: "approve-internal", id: paymentId });

      await axios.post(`/admin/payments/${paymentId}/approve`);

      await Swal.fire({
        icon: "success",
        title: text.internalPayment.approveSuccessTitle,
        text: text.internalPayment.approveSuccessText,
        confirmButtonColor: "#c99b2e",
      });

      fetchPayments();
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: text.alerts.errorTitle,
        text: err.response?.data?.message || text.internalPayment.approveError,
        confirmButtonColor: "#c99b2e",
      });
    } finally {
      setAction({ type: null, id: null });
    }
  };

  const rejectPayment = async (paymentId: number) => {
    const { value } = await Swal.fire({
      title: text.internalPayment.rejectTitle,
      input: "textarea",
      inputPlaceholder: text.internalPayment.rejectPlaceholder,
      showCancelButton: true,
      confirmButtonText: text.internalPayment.rejectButton,
      cancelButtonText: text.common.cancel,
      confirmButtonColor: "#c99b2e",
      background: "#fffaf0",
      color: "#06142b",
    });

    if (value === undefined) return;

    try {
      setAction({ type: "reject-internal", id: paymentId });

      await axios.post(`/admin/payments/${paymentId}/reject`, {
        notes: value,
      });

      await Swal.fire({
        icon: "success",
        title: text.internalPayment.rejectSuccessTitle,
        confirmButtonColor: "#c99b2e",
      });

      fetchPayments();
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: text.alerts.errorTitle,
        text: err.response?.data?.message || text.internalPayment.rejectError,
        confirmButtonColor: "#c99b2e",
      });
    } finally {
      setAction({ type: null, id: null });
    }
  };

  const approveForeignPayment = async (id: number) => {
    const result = await Swal.fire({
      icon: "question",
      title: text.foreignPayment.approveConfirmTitle,
      text: text.foreignPayment.approveConfirmText,
      showCancelButton: true,
      confirmButtonText: text.foreignPayment.approveConfirmButton,
      cancelButtonText: text.common.cancel,
      confirmButtonColor: "#c99b2e",
      background: "#fffaf0",
      color: "#06142b",
    });

    if (!result.isConfirmed) return;

    try {
      setAction({ type: "approve-foreign", id });
      await axios.post(`/admin/foreign-payments/${id}/approve`);
      await fetchPayments();

      Swal.fire({
        icon: "success",
        title: text.foreignPayment.approveSuccessTitle,
        confirmButtonColor: "#c99b2e",
      });
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: text.alerts.errorTitle,
        text: err.response?.data?.message || text.foreignPayment.approveError,
        confirmButtonColor: "#c99b2e",
      });
    } finally {
      setAction({ type: null, id: null });
    }
  };

  const rejectForeignPayment = async (id: number) => {
    const { value } = await Swal.fire({
      title: text.foreignPayment.rejectTitle,
      input: "textarea",
      inputPlaceholder: text.foreignPayment.rejectPlaceholder,
      showCancelButton: true,
      confirmButtonText: text.foreignPayment.rejectButton,
      cancelButtonText: text.common.cancel,
      confirmButtonColor: "#c99b2e",
      background: "#fffaf0",
      color: "#06142b",
    });

    if (value === undefined) return;

    try {
      setAction({ type: "reject-foreign", id });

      await axios.post(`/admin/foreign-payments/${id}/reject`, {
        notes: value || text.foreignPayment.defaultRejectNote,
      });

      await fetchPayments();

      Swal.fire({
        icon: "success",
        title: text.foreignPayment.rejectSuccessTitle,
        confirmButtonColor: "#c99b2e",
      });
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: text.alerts.errorTitle,
        text: err.response?.data?.message || text.foreignPayment.rejectError,
        confirmButtonColor: "#c99b2e",
      });
    } finally {
      setAction({ type: null, id: null });
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#fbf7ef] px-4">
        <div className="rounded-3xl border border-[#ead7ad] bg-white px-6 py-5 text-center font-black text-[#06142b] shadow-sm sm:px-8 sm:py-6">
          {text.loading}
        </div>
      </main>
    );
  }

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
                <CreditCard size={17} />
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
              <Wallet className="mx-auto mb-3 text-[#c99b2e]" size={28} />
              <p className="text-sm font-bold text-[#667085]">
                {text.hero.totalItems}
              </p>
              <h2 className="mt-1 text-4xl font-black text-[#06142b]">
                {bookings.length + payments.length + foreignPayments.length}
              </h2>
            </div>
          </div>
        </div>

        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:mb-8 lg:grid-cols-3">
          <StatBox label={text.stats.internalRequests} value={bookings.length} />
          <StatBox label={text.stats.internalPayments} value={payments.length} />
          <StatBox label={text.stats.foreignPayments} value={foreignPayments.length} />
        </div>

        <section className="mb-8 rounded-[26px] border border-[#ead7ad] bg-white p-4 shadow-sm sm:rounded-[30px] sm:p-6">
          <SectionHeader
            title={text.internalRequests.title}
            subtitle={text.internalRequests.subtitle}
            refreshLabel={text.common.refresh}
            refreshingLabel={text.common.refreshing}
            isRefreshing={isProcessing("refresh")}
            onRefresh={fetchPayments}
          />

          {bookings.length === 0 ? (
            <EmptyPayments
              text={text.internalRequests.empty}
              hint={text.common.emptyHint}
            />
          ) : (
            <div className="grid gap-5 xl:grid-cols-2">
              {bookings.map((booking) => (
                <article
                  key={booking.id}
                  className="rounded-[26px] border border-[#ead7ad] bg-[#fcfaf6] p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md sm:rounded-[30px] sm:p-5"
                >
                  <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <div className="mb-3 flex flex-wrap items-center gap-2">
                        <BookingStatusBadge
                          status={booking.status}
                          labels={text.status}
                        />

                        <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-[#667085]">
                          Booking #{booking.id}
                        </span>
                      </div>

                      <h2 className="break-words text-xl font-black text-[#06142b] sm:text-2xl">
                        {booking.destination || text.common.unknownTrip}
                      </h2>

                      <div className="mt-3 space-y-2 text-sm font-bold text-[#667085]">
                        <p className="flex items-center gap-2">
                          <User size={16} className="shrink-0 text-[#c99b2e]" />
                          <span className="break-words">
                            {booking.user?.name || text.common.unknown}
                          </span>
                        </p>

                        <p className="flex items-center gap-2">
                          <Mail size={16} className="shrink-0 text-[#c99b2e]" />
                          <span className="break-all">
                            {booking.user?.email || text.common.noEmail}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-[24px] border border-[#ead7ad] bg-white p-4 sm:rounded-[26px] sm:p-5">
                    <h3 className="mb-4 text-lg font-black text-[#06142b]">
                      {text.internalRequests.detailsTitle}
                    </h3>

                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      <InfoItem icon={<CalendarDays />} label={text.fields.travelDate} value={booking.travel_date || "-"} />
                      <InfoItem icon={<Clock />} label={text.fields.daysCount} value={`${booking.days_count || 0} ${text.common.day}`} />
                      <InfoItem icon={<Users />} label={text.fields.people} value={`${booking.adults_count || 0} ${text.common.adult} / ${booking.children_count || 0} ${text.common.child}`} />
                      <InfoItem icon={<Crown />} label={text.fields.tripClass} value={booking.trip_class || "-"} />
                      <InfoItem icon={<MapPin />} label={text.fields.destination} value={booking.destination || "-"} />
                      <InfoItem icon={<MessageSquare />} label={text.fields.notes} value={booking.notes || text.common.noNotes} />
                    </div>
                  </div>

                  {booking.design ? (
                    <div className="mt-4 rounded-[24px] border border-[#ead7ad] bg-white p-4 sm:rounded-[26px] sm:p-5">
                      <h3 className="mb-4 text-lg font-black text-[#06142b]">
                        {text.internalRequests.sentDesignTitle}
                      </h3>

                      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        <InfoItem icon={<Hotel />} label={text.fields.hotel} value={booking.design.hotel_name} />
                        <InfoItem icon={<Car />} label={text.fields.transport} value={booking.design.transport_type} />
                        <InfoItem icon={<CreditCard />} label={text.fields.cost} value={`${Number(booking.design.total_price).toLocaleString()} ${text.common.currency}`} />
                      </div>

                      {booking.design.details && <NotesBox title={text.fields.notes} notes={booking.design.details} />}
                    </div>
                  ) : (
                    <div className="mt-5 rounded-[24px] border border-dashed border-[#d8c69c] bg-white p-5 text-center">
                      <p className="font-black text-[#06142b]">
                        {text.internalRequests.notDesigned}
                      </p>

                      <button
                        type="button"
                        onClick={() => designBooking(booking.id)}
                        disabled={isProcessing("design", booking.id)}
                        className="mt-4 w-full rounded-full bg-[#c99b2e] py-3 text-sm font-black text-white transition hover:bg-[#b88a22] disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {isProcessing("design", booking.id)
                          ? text.common.sending
                          : text.internalRequests.designButton}
                      </button>
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-[26px] border border-[#ead7ad] bg-white p-4 shadow-sm sm:rounded-[30px] sm:p-6">
          <SectionHeader
            title={text.internalPayment.title}
            subtitle={text.internalPayment.subtitle}
            refreshLabel={text.common.refresh}
            refreshingLabel={text.common.refreshing}
            isRefreshing={isProcessing("refresh")}
            onRefresh={fetchPayments}
          />

          {payments.length === 0 ? (
            <EmptyPayments
              text={text.internalPayment.empty}
              hint={text.common.emptyHint}
            />
          ) : (
            <div className="grid gap-5 xl:grid-cols-2">
              {payments.map((payment) => (
                <article
                  key={payment.id}
                  className="rounded-[26px] border border-[#ead7ad] bg-[#fcfaf6] p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md sm:rounded-[30px] sm:p-5"
                >
                  <PaymentHeader
                    payment={payment}
                    text={text}
                  />

                  {payment.booking?.design && (
                    <div className="rounded-[24px] border border-[#ead7ad] bg-white p-4 sm:rounded-[26px] sm:p-5">
                      <h3 className="mb-4 text-lg font-black text-[#06142b]">
                        {text.internalPayment.summaryTitle}
                      </h3>

                      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        <InfoItem icon={<Hotel />} label={text.fields.hotel} value={payment.booking.design.hotel_name} />
                        <InfoItem icon={<Car />} label={text.fields.transport} value={payment.booking.design.transport_type} />
                        <InfoItem icon={<CreditCard />} label={text.fields.cost} value={`${Number(payment.booking.design.total_price).toLocaleString()} ${text.common.currency}`} />
                      </div>
                    </div>
                  )}

                  {payment.notes && <NotesBox title={text.fields.notes} notes={payment.notes} />}

                  {payment.status === "pending" && (
                    <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                      <button
                        type="button"
                        onClick={() => rejectPayment(payment.id)}
                        disabled={isProcessing("reject-internal", payment.id)}
                        className="inline-flex items-center justify-center gap-2 rounded-full border border-red-200 bg-red-50 px-6 py-3 text-sm font-black text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <XCircle size={17} />
                        {isProcessing("reject-internal", payment.id)
                          ? text.common.processing
                          : text.internalPayment.rejectButton}
                      </button>

                      <button
                        type="button"
                        onClick={() => approvePayment(payment.id)}
                        disabled={isProcessing("approve-internal", payment.id)}
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-[#c99b2e] px-7 py-3 text-sm font-black text-white shadow-lg shadow-[#c99b2e]/25 transition hover:-translate-y-1 hover:bg-[#b88a22] disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <CheckCircle size={17} />
                        {isProcessing("approve-internal", payment.id)
                          ? text.common.processing
                          : text.internalPayment.approveButton}
                      </button>
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="mt-8 rounded-[26px] border border-[#ead7ad] bg-white p-4 shadow-sm sm:rounded-[30px] sm:p-6">
          <SectionHeader
            title={text.foreignPayment.title}
            subtitle={text.foreignPayment.subtitle}
            refreshLabel={text.common.refresh}
            refreshingLabel={text.common.refreshing}
            isRefreshing={isProcessing("refresh")}
            onRefresh={fetchPayments}
          />

          {foreignPayments.length === 0 ? (
            <EmptyPayments
              text={text.foreignPayment.empty}
              hint={text.common.emptyHint}
            />
          ) : (
            <div className="grid gap-5 xl:grid-cols-2">
              {foreignPayments.map((payment) => (
                <article
                  key={payment.id}
                  className="rounded-[26px] border border-[#ead7ad] bg-[#fcfaf6] p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md sm:rounded-[30px] sm:p-5"
                >
                  <div className="mb-5">
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      <StatusBadge status={payment.status} labels={text.status} />

                      <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-[#667085]">
                        Foreign Payment #{payment.id}
                      </span>

                      <PaymentMethodBadge method={payment.method} />
                    </div>

                    <h2 className="break-words text-xl font-black text-[#06142b] sm:text-2xl">
                      {text.foreignPayment.travelTo}{" "}
                      {payment.request?.country?.name || text.common.unknownCountry}
                    </h2>

                    <div className="mt-3 space-y-2 text-sm font-bold text-[#667085]">
                      <p className="flex items-center gap-2">
                        <User size={16} className="shrink-0 text-[#c99b2e]" />
                        <span>{payment.request?.user?.name || text.common.unknown}</span>
                      </p>

                      <p className="flex items-center gap-2">
                        <Mail size={16} className="shrink-0 text-[#c99b2e]" />
                        <span className="break-all">{payment.request?.user?.email || text.common.noEmail}</span>
                      </p>

                      <p className="flex items-center gap-2">
                        <Phone size={16} className="shrink-0 text-[#c99b2e]" />
                        <span className="break-all">
                          {text.fields.transactionReference}: {payment.transaction_reference}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="rounded-[24px] border border-[#ead7ad] bg-white p-4 sm:rounded-[26px] sm:p-5">
                    <h3 className="mb-4 text-lg font-black text-[#06142b]">
                      {text.foreignPayment.summaryTitle}
                    </h3>

                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      <InfoItem icon={<Plane />} label={text.fields.country} value={payment.request?.country?.name || text.common.unknown} />
                      <InfoItem icon={<CreditCard />} label={text.fields.amount} value={`${Number(payment.amount).toLocaleString()} ${text.common.currency}`} />
                      <InfoItem icon={<MapPin />} label={text.fields.requestNumber} value={`#${payment.request?.id || "-"}`} />
                    </div>
                  </div>

                  {payment.notes && <NotesBox title={text.fields.notes} notes={payment.notes} />}

                  {payment.status === "pending" && (
                    <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                      <button
                        type="button"
                        onClick={() => rejectForeignPayment(payment.id)}
                        disabled={isProcessing("reject-foreign", payment.id)}
                        className="inline-flex items-center justify-center gap-2 rounded-full border border-red-200 bg-red-50 px-6 py-3 text-sm font-black text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <XCircle size={17} />
                        {isProcessing("reject-foreign", payment.id)
                          ? text.common.processing
                          : text.foreignPayment.rejectButton}
                      </button>

                      <button
                        type="button"
                        onClick={() => approveForeignPayment(payment.id)}
                        disabled={isProcessing("approve-foreign", payment.id)}
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-[#c99b2e] px-7 py-3 text-sm font-black text-white shadow-lg shadow-[#c99b2e]/25 transition hover:-translate-y-1 hover:bg-[#b88a22] disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <CheckCircle size={17} />
                        {isProcessing("approve-foreign", payment.id)
                          ? text.common.processing
                          : text.foreignPayment.approveButton}
                      </button>
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

function StatBox({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-[24px] border border-[#ead7ad] bg-white p-5 shadow-sm sm:rounded-[26px]">
      <p className="text-sm font-bold text-[#667085]">{label}</p>
      <h3 className="mt-2 text-4xl font-black text-[#06142b]">{value}</h3>
    </div>
  );
}

function SectionHeader({
  title,
  subtitle,
  onRefresh,
  refreshLabel,
  refreshingLabel,
  isRefreshing,
}: {
  title: string;
  subtitle: string;
  onRefresh: () => void;
  refreshLabel: string;
  refreshingLabel: string;
  isRefreshing: boolean;
}) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-xl font-black text-[#06142b] sm:text-2xl">
          {title}
        </h2>
        <p className="mt-1 text-sm font-bold text-[#667085]">{subtitle}</p>
      </div>

      <button
        type="button"
        onClick={onRefresh}
        disabled={isRefreshing}
        className="inline-flex items-center justify-center gap-2 rounded-full border border-[#ead7ad] bg-[#fcfaf6] px-4 py-2 text-sm font-black text-[#06142b] transition hover:bg-[#fffaf0] disabled:cursor-not-allowed disabled:opacity-60"
      >
        <RefreshCcw size={15} className={isRefreshing ? "animate-spin" : ""} />
        {isRefreshing ? refreshingLabel : refreshLabel}
      </button>
    </div>
  );
}

function PaymentHeader({
  payment,
  text,
}: {
  payment: Payment;
  text: any;
}) {
  return (
    <div className="mb-5">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <StatusBadge status={payment.status} labels={text.status} />

        <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-[#667085]">
          Payment #{payment.id}
        </span>

        <PaymentMethodBadge method={payment.method} />
      </div>

      <h2 className="break-words text-xl font-black text-[#06142b] sm:text-2xl">
        {payment.booking?.destination || text.common.unknownTrip}
      </h2>

      <div className="mt-3 space-y-2 text-sm font-bold text-[#667085]">
        <p className="flex items-center gap-2">
          <User size={16} className="shrink-0 text-[#c99b2e]" />
          <span>{payment.user?.name || text.common.unknown}</span>
        </p>

        <p className="flex items-center gap-2">
          <Mail size={16} className="shrink-0 text-[#c99b2e]" />
          <span className="break-all">{payment.user?.email || text.common.noEmail}</span>
        </p>

        {payment.transaction_reference && (
          <p className="flex items-center gap-2">
            <Phone size={16} className="shrink-0 text-[#c99b2e]" />
            <span className="break-all">
              {text.fields.transactionReference}: {payment.transaction_reference}
            </span>
          </p>
        )}
      </div>
    </div>
  );
}

function EmptyPayments({ text, hint }: { text: string; hint: string }) {
  return (
    <div className="rounded-[26px] border border-dashed border-[#d8c69c] bg-white p-8 text-center sm:rounded-[30px] sm:p-10">
      <p className="text-lg font-black text-[#06142b] sm:text-xl">{text}</p>
      <p className="mt-2 text-sm text-[#667085] sm:text-base">{hint}</p>
    </div>
  );
}

function NotesBox({ title, notes }: { title: string; notes: string }) {
  return (
    <div className="mt-4 rounded-[22px] border border-[#ead7ad] bg-[#fffaf0] p-4">
      <p className="text-sm font-black text-[#c99b2e]">{title}</p>
      <p className="mt-2 break-words text-sm leading-7 text-[#667085]">
        {notes}
      </p>
    </div>
  );
}

function PaymentMethodBadge({ method }: { method: string }) {
  return (
    <span className="rounded-full bg-[#f5ead2] px-3 py-1 text-xs font-black text-[#c99b2e]">
      {method === "vodafone_cash" ? "Vodafone Cash" : "InstaPay"}
    </span>
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
    <div className="rounded-[18px] border border-[#ead7ad] bg-[#fcfaf6] p-3">
      <div className="mb-2 flex items-center gap-2 text-[#c99b2e]">
        <span className="[&>svg]:h-4 [&>svg]:w-4">{icon}</span>
        <span className="text-xs font-black">{label}</span>
      </div>
      <p className="break-words text-sm font-bold text-[#06142b]">{value}</p>
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
    pending: "bg-yellow-100 text-yellow-700",
    approved: "bg-green-100 text-green-700",
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

function BookingStatusBadge({
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
    completed: "bg-green-100 text-green-700",
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
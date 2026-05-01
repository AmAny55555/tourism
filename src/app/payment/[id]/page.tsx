"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "../../../lib/axios";
import Swal from "sweetalert2";
import Loading from "@/app/loading";
import { useLanguage } from "@/context/language-context";
import {
  CreditCard,
  Hotel,
  Smartphone,
  Wallet,
  Car,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";

type Booking = {
  id: number;
  destination: string;
  status: string;
  design?: {
    hotel_name: string;
    transport_type: string;
    total_price: number;
    details: string;
  } | null;
  payment?: {
    method: string;
    status: string;
    transaction_reference?: string;
  } | null;
};

export default function PaymentPage() {
  const { id } = useParams();
  const router = useRouter();
  const { lang, t } = useLanguage();

  const text = t.common.paymentPage;
  const isAr = lang === "ar";
  const BackIcon = isAr ? ArrowRight : ArrowLeft;

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [method, setMethod] = useState("vodafone_cash");
  const [transactionReference, setTransactionReference] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchPayment = async () => {
      try {
        const res = await axios.get(`/payments/${id}`);
        setBooking(res.data.booking);
      } catch (err: any) {
        Swal.fire({
          icon: "error",
          title: text.alerts.errorTitle,
          text: err.response?.data?.message || text.alerts.loadError,
          confirmButtonColor: "#c99b2e",
        });
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchPayment();
  }, [id, text.alerts.errorTitle, text.alerts.loadError]);

  const submitPayment = async () => {
    try {
      setSubmitting(true);

      await axios.post(`/payments/${id}`, {
        method,
        transaction_reference: transactionReference,
        notes,
      });

      await Swal.fire({
        icon: "success",
        title: text.alerts.successTitle,
        text: text.alerts.successText,
        confirmButtonColor: "#c99b2e",
      });

      router.push("/dashboard");
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: text.alerts.errorTitle,
        text: err.response?.data?.message || text.alerts.submitError,
        confirmButtonColor: "#c99b2e",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (!booking) return null;

  return (
    <main
      dir={isAr ? "rtl" : "ltr"}
      className="min-h-screen bg-[#fbf7ef] px-3 py-6 text-[#06142b] sm:px-6 sm:py-8 lg:px-8"
    >
      <section className="mx-auto max-w-[1100px]">
        <button
          type="button"
          onClick={() => router.push("/dashboard")}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#ead7ad] bg-white px-5 py-3 text-sm font-black text-[#06142b] transition hover:bg-[#fffaf0] sm:text-base"
        >
          <BackIcon size={18} />
          {text.common.backToDashboard}
        </button>

        <div className="relative mb-6 overflow-hidden rounded-[28px] border border-[#ead7ad] bg-gradient-to-l from-[#f3e7c9] via-white to-[#fffaf0] p-5 shadow-sm sm:mb-8 sm:rounded-[34px] sm:p-8">
          <div className="absolute -left-24 -top-24 h-64 w-64 rounded-full bg-[#c99b2e]/10 blur-3xl" />

          <div className="relative z-10">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#c99b2e]/30 bg-white/80 px-4 py-2 text-xs font-black text-[#c99b2e] sm:px-5 sm:text-sm">
              <CreditCard size={17} />
              {text.hero.badge}
            </span>

            <h1 className="break-words text-3xl font-black leading-tight text-[#06142b] sm:text-5xl">
              {booking.destination}
            </h1>

            <p className="mt-4 max-w-2xl text-sm font-bold leading-7 text-[#667085] sm:text-base sm:leading-8">
              {text.hero.description}
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
          <section className="rounded-[28px] border border-[#ead7ad] bg-white p-5 shadow-sm sm:rounded-[30px] sm:p-6">
            <h2 className="text-2xl font-black text-[#06142b]">
              {text.payment.title}
            </h2>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setMethod("vodafone_cash")}
                className={`rounded-[24px] border p-5 text-start transition hover:-translate-y-1 ${
                  method === "vodafone_cash"
                    ? "border-[#c99b2e] bg-[#fffaf0]"
                    : "border-[#ead7ad] bg-[#fcfaf6]"
                }`}
              >
                <Wallet className="mb-4 text-[#c99b2e]" />

                <h3 className="font-black text-[#06142b]">Vodafone Cash</h3>

                <p className="mt-2 text-sm font-bold leading-6 text-[#667085]">
                  {text.payment.vodafoneDescription}
                </p>

                <p className="mt-3 break-words font-black text-[#c99b2e]">
                  01000000000
                </p>
              </button>

              <button
                type="button"
                onClick={() => setMethod("instapay")}
                className={`rounded-[24px] border p-5 text-start transition hover:-translate-y-1 ${
                  method === "instapay"
                    ? "border-[#c99b2e] bg-[#fffaf0]"
                    : "border-[#ead7ad] bg-[#fcfaf6]"
                }`}
              >
                <Smartphone className="mb-4 text-[#c99b2e]" />

                <h3 className="font-black text-[#06142b]">InstaPay</h3>

                <p className="mt-2 text-sm font-bold leading-6 text-[#667085]">
                  {text.payment.instapayDescription}
                </p>

                <p className="mt-3 break-words font-black text-[#c99b2e]">
                  taui@instapay
                </p>
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <label className="mb-2 block text-sm font-black text-[#06142b]">
                  {text.form.transactionReferenceLabel}
                </label>

                <input
                  value={transactionReference}
                  onChange={(e) => setTransactionReference(e.target.value)}
                  placeholder={text.form.transactionReferencePlaceholder}
                  className="h-14 w-full rounded-2xl border border-[#ead7ad] bg-[#fcfaf6] px-5 font-bold text-[#06142b] outline-none transition focus:border-[#c99b2e]"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-black text-[#06142b]">
                  {text.form.notesLabel}
                </label>

                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={text.form.notesPlaceholder}
                  className="min-h-[120px] w-full resize-none rounded-2xl border border-[#ead7ad] bg-[#fcfaf6] px-5 py-4 font-bold text-[#06142b] outline-none transition focus:border-[#c99b2e]"
                />
              </div>

              <button
                type="button"
                onClick={submitPayment}
                disabled={submitting}
                className="flex h-14 w-full items-center justify-center gap-2 rounded-full bg-[#c99b2e] px-5 text-sm font-black text-white shadow-lg shadow-[#c99b2e]/25 transition hover:-translate-y-1 hover:bg-[#b88a22] disabled:cursor-not-allowed disabled:opacity-60 sm:text-base"
              >
                <CheckCircle size={19} />
                {submitting ? text.form.submitting : text.form.submit}
              </button>
            </div>
          </section>

          <aside className="rounded-[28px] border border-[#ead7ad] bg-white p-5 shadow-sm sm:rounded-[30px] sm:p-6 lg:sticky lg:top-8 lg:h-fit">
            <h2 className="text-2xl font-black text-[#06142b]">
              {text.summary.title}
            </h2>

            <div className="mt-5 space-y-3">
              <SummaryItem
                icon={<Hotel />}
                label={text.summary.hotel}
                value={booking.design?.hotel_name || text.summary.notSpecified}
              />

              <SummaryItem
                icon={<Car />}
                label={text.summary.transport}
                value={
                  booking.design?.transport_type || text.summary.notSpecified
                }
              />

              <SummaryItem
                icon={<CreditCard />}
                label={text.summary.totalPrice}
                value={
                  booking.design?.total_price
                    ? `${Number(
                        booking.design.total_price
                      ).toLocaleString()} ${text.summary.currency}`
                    : text.summary.notSpecified
                }
              />
            </div>

            {booking.design?.details && (
              <div className="mt-5 rounded-[24px] border border-[#ead7ad] bg-[#fcfaf6] p-5">
                <p className="mb-2 text-sm font-black text-[#c99b2e]">
                  {text.summary.programDetails}
                </p>

                <p className="whitespace-pre-line text-sm font-bold leading-8 text-[#667085]">
                  {booking.design.details}
                </p>
              </div>
            )}

            <div className="mt-5 rounded-[24px] border border-[#ead7ad] bg-[#fffaf0] p-5 text-sm font-bold leading-8 text-[#667085]">
              {text.summary.reviewNote}
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

function SummaryItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[20px] border border-[#ead7ad] bg-[#fcfaf6] p-4">
      <div className="mb-2 flex items-center gap-2 text-[#c99b2e]">
        <span className="[&>svg]:h-5 [&>svg]:w-5">{icon}</span>
        <span className="text-sm font-black">{label}</span>
      </div>

      <p className="break-words font-black text-[#06142b]">{value}</p>
    </div>
  );
}
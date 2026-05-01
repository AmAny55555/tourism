"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "../../../lib/axios";
import Swal from "sweetalert2";
import { useLanguage } from "@/context/language-context";
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  CreditCard,
  FileText,
  MapPin,
  Smartphone,
  Wallet,
} from "lucide-react";

type ForeignTrip = {
  id: number;
  status: string;
  price?: number | null;
  admin_notes?: string | null;
  country?: {
    name: string;
  };
};

export default function ForeignPaymentPage() {
  const { id } = useParams();
  const router = useRouter();
  const { lang, t } = useLanguage();

  const isAr = lang === "ar";
  const text = t.customer.foreignPaymentPage;
  const BackIcon = isAr ? ArrowRight : ArrowLeft;

  const [trip, setTrip] = useState<ForeignTrip | null>(null);
  const [loading, setLoading] = useState(true);
  const [method, setMethod] = useState("vodafone_cash");
  const [transactionReference, setTransactionReference] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const res = await axios.get(`/foreign-trip/${id}`);
        setTrip(res.data.trip);
      } catch (err: any) {
        Swal.fire({
          icon: "error",
          title: text.alerts.loadErrorTitle,
          text:
            err.response?.data?.message ||
            text.alerts.loadErrorText,
          confirmButtonColor: "#c99b2e",
        });

        router.push("/dashboard");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchTrip();
  }, [id, router, text.alerts.loadErrorTitle, text.alerts.loadErrorText]);

  const submitPayment = async () => {
    if (!transactionReference.trim()) {
      Swal.fire({
        icon: "warning",
        title: text.alerts.transactionRequired,
        confirmButtonColor: "#c99b2e",
      });
      return;
    }

    try {
      setSubmitting(true);

      await axios.post(`/foreign-payments/${id}`, {
        method,
        transaction_reference: transactionReference,
        notes,
      });

      await Swal.fire({
        icon: "success",
        title: text.alerts.paymentSentTitle,
        text: text.alerts.paymentSentText,
        confirmButtonColor: "#c99b2e",
      });

      router.push("/dashboard");
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: text.alerts.errorTitle,
        text: err.response?.data?.message || text.alerts.paymentSendError,
        confirmButtonColor: "#c99b2e",
      });
    } finally {
      setSubmitting(false);
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

  if (!trip) return null;

  return (
    <main
      dir={isAr ? "rtl" : "ltr"}
      className="min-h-screen bg-[#fbf7ef] px-3 py-6 sm:px-6 sm:py-8 lg:px-8"
    >
      <section className="mx-auto max-w-[1100px]">
        <button
          type="button"
          onClick={() => router.push("/dashboard")}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#ead7ad] bg-white px-5 py-3 text-sm font-black text-[#06142b] transition hover:bg-[#fffaf0] sm:text-base"
        >
          <BackIcon size={18} />
          {text.backToDashboard}
        </button>

        <div className="relative mb-6 overflow-hidden rounded-[28px] border border-[#ead7ad] bg-gradient-to-l from-[#f3e7c9] via-white to-[#fffaf0] p-5 shadow-sm sm:mb-8 sm:rounded-[34px] sm:p-8">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#c99b2e]/30 bg-white/80 px-4 py-2 text-xs font-black text-[#c99b2e] sm:px-5 sm:text-sm">
            <CreditCard size={17} />
            {text.hero.badge}
          </span>

          <h1 className="break-words text-2xl font-black text-[#06142b] sm:text-4xl lg:text-5xl">
            {text.hero.travelTo} {trip.country?.name || text.common.unknownCountry}
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-[#667085] sm:text-base sm:leading-8">
            {text.hero.description}
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
          <section className="rounded-[26px] border border-[#ead7ad] bg-white p-4 shadow-sm sm:rounded-[30px] sm:p-6">
            <h2 className="text-xl font-black text-[#06142b] sm:text-2xl">
              {text.paymentMethod.title}
            </h2>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setMethod("vodafone_cash")}
                className={`rounded-[24px] border p-5 transition ${
                  isAr ? "text-right" : "text-left"
                } ${
                  method === "vodafone_cash"
                    ? "border-[#c99b2e] bg-[#fffaf0]"
                    : "border-[#ead7ad] bg-[#fcfaf6]"
                }`}
              >
                <Wallet className="mb-4 text-[#c99b2e]" />
                <h3 className="font-black text-[#06142b]">Vodafone Cash</h3>
                <p className="mt-2 text-sm leading-6 text-[#667085]">
                  {text.paymentMethod.vodafoneDescription}
                </p>
                <p className="mt-3 font-black text-[#c99b2e]">01000000000</p>
              </button>

              <button
                type="button"
                onClick={() => setMethod("instapay")}
                className={`rounded-[24px] border p-5 transition ${
                  isAr ? "text-right" : "text-left"
                } ${
                  method === "instapay"
                    ? "border-[#c99b2e] bg-[#fffaf0]"
                    : "border-[#ead7ad] bg-[#fcfaf6]"
                }`}
              >
                <Smartphone className="mb-4 text-[#c99b2e]" />
                <h3 className="font-black text-[#06142b]">InstaPay</h3>
                <p className="mt-2 text-sm leading-6 text-[#667085]">
                  {text.paymentMethod.instapayDescription}
                </p>
                <p className="mt-3 font-black text-[#c99b2e]">taui@instapay</p>
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <label className="mb-2 block text-sm font-black text-[#06142b]">
                  {text.form.transactionReference}
                </label>
                <input
                  value={transactionReference}
                  onChange={(e) => setTransactionReference(e.target.value)}
                  placeholder={text.form.transactionPlaceholder}
                  className="h-14 w-full rounded-2xl border border-[#ead7ad] bg-[#fcfaf6] px-5 outline-none transition focus:border-[#c99b2e]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-black text-[#06142b]">
                  {text.form.notes}
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={text.form.notesPlaceholder}
                  className="min-h-[120px] w-full resize-none rounded-2xl border border-[#ead7ad] bg-[#fcfaf6] px-5 py-4 outline-none transition focus:border-[#c99b2e]"
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

          <aside className="rounded-[26px] border border-[#ead7ad] bg-white p-4 shadow-sm sm:rounded-[30px] sm:p-6">
            <h2 className="text-xl font-black text-[#06142b] sm:text-2xl">
              {text.summary.title}
            </h2>

            <div className="mt-5 space-y-3">
              <SummaryItem
                icon={<MapPin />}
                label={text.summary.country}
                value={trip.country?.name || text.common.unknownCountry}
              />

              <SummaryItem
                icon={<CreditCard />}
                label={text.summary.cost}
                value={
                  trip.price
                    ? `${Number(trip.price).toLocaleString()} ${text.common.currency}`
                    : text.common.notSet
                }
              />
            </div>

            {trip.admin_notes && (
              <div className="mt-5 rounded-[24px] border border-[#ead7ad] bg-[#fcfaf6] p-5">
                <p className="mb-2 flex items-center gap-2 text-sm font-black text-[#c99b2e]">
                  <FileText size={17} />
                  {text.summary.adminNotes}
                </p>
                <p className="whitespace-pre-line break-words text-sm leading-8 text-[#667085]">
                  {trip.admin_notes}
                </p>
              </div>
            )}

            <div className="mt-5 rounded-[24px] border border-[#ead7ad] bg-[#fffaf0] p-5 text-sm leading-8 text-[#667085]">
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
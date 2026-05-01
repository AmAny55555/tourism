"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "@/lib/axios";
import Swal from "sweetalert2";
import { CalendarDays, Loader2, Send, Users } from "lucide-react";
import { useLanguage } from "@/context/language-context";

export default function InternalBookingPage() {
  const { slug } = useParams();
  const router = useRouter();
  const { lang } = useLanguage();

  const isAr = lang === "ar";

  const [destination, setDestination] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  const [form, setForm] = useState({
    travel_date: "",
    days: "",
    adults: 1,
    children: 0,
    notes: "",
  });

  useEffect(() => {
    const fetchDestination = async () => {
      try {
        const res = await axios.get(`/destinations/${slug}`);
        setDestination(res.data.destination);
      } catch {
        Swal.fire("خطأ", "لم يتم العثور على الرحلة", "error");
        router.push("/tours");
      } finally {
        setPageLoading(false);
      }
    };

    fetchDestination();
  }, [slug, router]);

  const handleSubmit = async () => {
    if (!form.travel_date || !form.days) {
      Swal.fire("تنبيه", "من فضلك أدخل تاريخ السفر وعدد الأيام", "warning");
      return;
    }

    try {
      setLoading(true);

    await axios.post("/bookings", {
  destination: destination.name,
  travel_date: form.travel_date,
  days_count: Number(form.days),
  adults_count: Number(form.adults),
  children_count: Number(form.children),
  trip_class: destination.category || "Economy Class",
  notes: form.notes,
});

      await Swal.fire("تم", "تم إرسال طلب الرحلة بنجاح", "success");
      router.push("/dashboard");
    } catch (err: any) {
      Swal.fire(
        "خطأ",
        err.response?.data?.message || "حصلت مشكلة أثناء إرسال الطلب",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#fbf7ef]">
        <div className="rounded-3xl bg-white px-8 py-6 font-black text-[#06142b] shadow">
          جاري التحميل...
        </div>
      </main>
    );
  }

  if (!destination) return null;

  return (
    <main
      dir={isAr ? "rtl" : "ltr"}
      className="min-h-screen bg-[#fbf7ef] px-4 py-10"
    >
      <section className="mx-auto max-w-5xl">
        <div className="mb-8 overflow-hidden rounded-[34px] border border-[#eadfca] bg-white shadow-xl">
          <div className="bg-gradient-to-l from-[#06142b] to-[#d4af37] p-8 text-white">
            <span className="mb-4 inline-flex rounded-full bg-white/15 px-5 py-2 text-sm font-black text-[#f4c542]">
              TAUI ✦
            </span>

            <h1 className="text-3xl font-black sm:text-5xl">
              احجز رحلة إلى {destination.name}
            </h1>

            <p className="mt-4 max-w-2xl text-sm font-bold leading-7 text-white/80">
              املأ بيانات الرحلة، وسيقوم الأدمن بمراجعة الطلب وتجهيز تفاصيل الفندق والمواصلات والسعر النهائي.
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="rounded-[30px] border border-[#eadfca] bg-white p-6 shadow-sm">
            <h2 className="mb-6 flex items-center gap-2 text-2xl font-black text-[#06142b]">
              <CalendarDays className="text-[#d4af37]" />
              تفاصيل الحجز
            </h2>

            <div className="grid gap-5">
              <div>
                <label className="mb-2 block font-black text-[#06142b]">
                  تاريخ السفر
                </label>
                <input
                  type="date"
                  value={form.travel_date}
                  onChange={(e) =>
                    setForm({ ...form, travel_date: e.target.value })
                  }
                  className="h-14 w-full rounded-2xl border border-[#eadfca] bg-[#fcfaf6] px-5 font-bold outline-none focus:border-[#d4af37]"
                />
              </div>

              <div>
                <label className="mb-2 block font-black text-[#06142b]">
                  عدد الأيام
                </label>
                <input
                  type="number"
                  min="1"
                  max="14"
                  value={form.days}
                  onChange={(e) => setForm({ ...form, days: e.target.value })}
                  placeholder="مثال: 3"
                  className="h-14 w-full rounded-2xl border border-[#eadfca] bg-[#fcfaf6] px-5 font-bold outline-none focus:border-[#d4af37]"
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block font-black text-[#06142b]">
                    عدد البالغين
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={form.adults}
                    onChange={(e) =>
                      setForm({ ...form, adults: Number(e.target.value) })
                    }
                    className="h-14 w-full rounded-2xl border border-[#eadfca] bg-[#fcfaf6] px-5 font-bold outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div>
                  <label className="mb-2 block font-black text-[#06142b]">
                    عدد الأطفال
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={form.children}
                    onChange={(e) =>
                      setForm({ ...form, children: Number(e.target.value) })
                    }
                    className="h-14 w-full rounded-2xl border border-[#eadfca] bg-[#fcfaf6] px-5 font-bold outline-none focus:border-[#d4af37]"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block font-black text-[#06142b]">
                  ملاحظات
                </label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="اكتب أي تفاصيل إضافية..."
                  className="min-h-32 w-full rounded-2xl border border-[#eadfca] bg-[#fcfaf6] px-5 py-4 font-bold outline-none focus:border-[#d4af37]"
                />
              </div>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="mt-2 flex h-14 w-full items-center justify-center gap-2 rounded-full bg-[#d4af37] font-black text-white shadow-lg shadow-[#d4af37]/25 transition hover:bg-[#b8962e] disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={19} />
                    جاري الإرسال...
                  </>
                ) : (
                  <>
                    <Send size={19} />
                    إرسال الطلب
                  </>
                )}
              </button>
            </div>
          </div>

          <aside className="h-fit rounded-[30px] border border-[#eadfca] bg-white p-6 shadow-sm">
            <div className="rounded-[24px] bg-[#fffaf0] p-5">
              <h3 className="text-xl font-black text-[#06142b]">
                ملخص الرحلة
              </h3>

              <div className="mt-5 space-y-3 text-sm font-bold text-[#667085]">
                <p>الوجهة: {destination.name}</p>
                <p>السعر الأساسي: {Number(destination.price || 0).toLocaleString()} جنيه</p>
                <p>المدة: {destination.days || 1} أيام</p>
              </div>
            </div>

            <div className="mt-5 flex items-start gap-2 rounded-2xl bg-green-50 p-4 text-sm font-bold leading-6 text-green-700">
              <Users size={18} className="mt-1 shrink-0" />
              بعد إرسال الطلب، سيتم تجهيز العرض المناسب قبل تأكيد الحجز.
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
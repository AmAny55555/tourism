"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import axios from "@/lib/axios";
import Swal from "sweetalert2";
import { useLanguage } from "@/context/language-context";
import { Send, Loader2 } from "lucide-react";

export default function InternalBookingPage() {
  const { slug } = useParams();
  const router = useRouter();
  const { lang } = useLanguage();

  const isAr = lang === "ar";

  const [form, setForm] = useState({
    travel_date: "",
    days: "",
    adults: 1,
    children: 0,
    notes: "",
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);

      // 🔥 نجيب الـ destination الأول
      const res = await axios.get(`/destinations/${slug}`);

      await axios.post("/bookings", {
        destination_id: res.data.destination.id,
        ...form,
      });

      Swal.fire("تم", "تم إرسال الطلب", "success");

      router.push("/dashboard");
    } catch {
      Swal.fire("خطأ", "حصل مشكلة", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      dir={isAr ? "rtl" : "ltr"}
      className="min-h-screen bg-[#fcfaf6] p-6"
    >
      <div className="mx-auto max-w-xl rounded-3xl bg-white p-6 shadow">

        <h1 className="text-2xl font-black mb-6">
          احجز الرحلة
        </h1>

        <div className="space-y-4">

          <input
            type="date"
            className="input"
            onChange={(e) =>
              setForm({ ...form, travel_date: e.target.value })
            }
          />

          <input
            type="number"
            placeholder="عدد الأيام"
            className="input"
            onChange={(e) =>
              setForm({ ...form, days: e.target.value })
            }
          />

          <input
            type="number"
            placeholder="عدد البالغين"
            className="input"
            onChange={(e) =>
              setForm({ ...form, adults: Number(e.target.value) })
            }
          />

          <input
            type="number"
            placeholder="عدد الأطفال"
            className="input"
            onChange={(e) =>
              setForm({ ...form, children: Number(e.target.value) })
            }
          />

          <textarea
            placeholder="ملاحظات"
            className="input"
            onChange={(e) =>
              setForm({ ...form, notes: e.target.value })
            }
          />

          <button
            onClick={handleSubmit}
            className="btn w-full"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Send />}
            إرسال الطلب
          </button>
        </div>
      </div>
    </main>
  );
}
"use client";

import { useMemo, useState } from "react";
import axios from "@/lib/axios";
import Swal from "sweetalert2";
import {
  CalendarDays,
  CheckCircle2,
  Image as ImageIcon,
  Loader2,
  MapPin,
  Mountain,
  Plus,
  Sparkles,
  UploadCloud,
} from "lucide-react";

export default function AdminDestinationsPage() {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    price: "",
    location: "",
    category: "Economy Class",
    days: "1",
    rating: "4.5",
    badge: "",
    description: "",
    overview: "",
    best_time_to_visit: "",
    landmarks: "",
    is_active: true,
    is_featured: false,
  });

  const [image, setImage] = useState<File | null>(null);
  const [cover, setCover] = useState<File | null>(null);

  const landmarksList = useMemo(() => {
    return form.landmarks
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }, [form.landmarks]);

  const imagePreview = image ? URL.createObjectURL(image) : null;
  const coverPreview = cover ? URL.createObjectURL(cover) : null;

  const updateForm = (key: string, value: string | boolean) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const resetForm = () => {
    setForm({
      name: "",
      price: "",
      location: "",
      category: "Economy Class",
      days: "1",
      rating: "4.5",
      badge: "",
      description: "",
      overview: "",
      best_time_to_visit: "",
      landmarks: "",
      is_active: true,
      is_featured: false,
    });

    setImage(null);
    setCover(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim() || !form.price.trim()) {
      Swal.fire({
        icon: "warning",
        title: "بيانات ناقصة",
        text: "اسم المحافظة والسعر مطلوبين.",
        confirmButtonColor: "#c99b2e",
      });
      return;
    }

    const formData = new FormData();

    formData.append("name", form.name);
    formData.append("price", form.price);
    formData.append("location", form.location);
    formData.append("category", form.category);
    formData.append("days", form.days);
    formData.append("rating", form.rating);
    formData.append("badge", form.badge);
    formData.append("description", form.description);
    formData.append("overview", form.overview);
    formData.append("best_time_to_visit", form.best_time_to_visit);

    landmarksList.forEach((item, index) => {
      formData.append(`landmarks[${index}]`, item);
    });

    formData.append("is_active", form.is_active ? "1" : "0");
    formData.append("is_featured", form.is_featured ? "1" : "0");

    if (image) formData.append("image", image);
    if (cover) formData.append("cover_image", cover);

    try {
      setLoading(true);

      await axios.post("/admin/destinations", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      Swal.fire({
        icon: "success",
        title: "تم إضافة المحافظة",
        text: "المحافظة ظهرت الآن في الرحلات الداخلية.",
        confirmButtonColor: "#c99b2e",
      });

      resetForm();
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "حدث خطأ",
        text: err?.response?.data?.message || "لم يتم إضافة المحافظة.",
        confirmButtonColor: "#c99b2e",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      dir="rtl"
      className="space-y-6 px-3 pb-10 sm:px-0 lg:space-y-8"
    >
      <section className="relative overflow-hidden rounded-[28px] border border-[#ead7ad] bg-gradient-to-l from-[#f3e7c9] via-white to-[#fffaf0] p-5 shadow-sm sm:rounded-[36px] sm:p-8 lg:p-10">
        <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-[#c99b2e]/20 blur-3xl" />
        <div className="absolute -bottom-24 right-16 h-72 w-72 rounded-full bg-[#06142b]/10 blur-3xl" />

        <div className="relative z-10 flex flex-col gap-4">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-[#c99b2e]/30 bg-white/80 px-5 py-2 text-sm font-black text-[#c99b2e]">
            <Mountain size={17} />
            الرحلات الداخلية
          </span>

          <h1 className="text-3xl font-black text-[#06142b] sm:text-5xl">
            إدارة المحافظات والرحلات الداخلية
          </h1>

          <p className="max-w-2xl text-sm font-bold leading-8 text-[#667085] sm:text-base">
            أضف محافظة جديدة بكل تفاصيلها: صور، نبذة، معالم، سعر، وأفضل وقت للزيارة بنفس شكل إدارة الفورمات الخارجية.
          </p>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_420px]">
        <form
          onSubmit={handleSubmit}
          className="rounded-[28px] border border-[#ead7ad] bg-white p-5 shadow-sm sm:rounded-[30px] sm:p-6"
        >
          <div className="mb-6 flex items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#f5ead2] text-[#c99b2e]">
              <Plus />
            </div>

            <div>
              <h2 className="text-2xl font-black text-[#06142b]">
                إضافة محافظة جديدة
              </h2>
              <p className="mt-1 text-sm font-bold leading-6 text-[#667085]">
                البيانات دي هتظهر للعميل في كروت الرحلات وصفحة تفاصيل المحافظة.
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <InputGroup label="اسم المحافظة" hint="مثال: الأقصر، أسوان، شرم الشيخ">
              <input
                className="admin-input"
                placeholder="مثال: الأقصر"
                value={form.name}
                onChange={(e) => updateForm("name", e.target.value)}
              />
            </InputGroup>

            <InputGroup label="الموقع" hint="مثال: جنوب مصر، البحر الأحمر">
              <input
                className="admin-input"
                placeholder="مثال: جنوب مصر"
                value={form.location}
                onChange={(e) => updateForm("location", e.target.value)}
              />
            </InputGroup>

            <InputGroup label="السعر" hint="السعر بالجنيه المصري">
              <input
                type="number"
                className="admin-input"
                placeholder="مثال: 2500"
                value={form.price}
                onChange={(e) => updateForm("price", e.target.value)}
              />
            </InputGroup>

            <InputGroup label="عدد الأيام" hint="مثال: 1 إلى 14 يوم">
              <input
                type="number"
                min={1}
                max={14}
                className="admin-input"
                value={form.days}
                onChange={(e) => updateForm("days", e.target.value)}
              />
            </InputGroup>

            <InputGroup label="فئة الرحلة" hint="نفس فئات الرحلات في الموقع">
              <select
                className="admin-input"
                value={form.category}
                onChange={(e) => updateForm("category", e.target.value)}
              >
                <option value="Economy Class">Economy Class</option>
                <option value="Premium Economy Class">
                  Premium Economy Class
                </option>
                <option value="Business Class">Business Class</option>
                <option value="First Class">First Class</option>
              </select>
            </InputGroup>

            <InputGroup label="التقييم" hint="من 0 إلى 5">
              <input
                type="number"
                min={0}
                max={5}
                step="0.1"
                className="admin-input"
                value={form.rating}
                onChange={(e) => updateForm("rating", e.target.value)}
              />
            </InputGroup>

            <InputGroup label="Badge اختياري" hint="مثال: الأكثر طلبًا، جديد">
              <input
                className="admin-input"
                placeholder="مثال: الأكثر طلبًا"
                value={form.badge}
                onChange={(e) => updateForm("badge", e.target.value)}
              />
            </InputGroup>

            <InputGroup label="أفضل وقت للزيارة" hint="مثال: من أكتوبر إلى أبريل">
              <input
                className="admin-input"
                placeholder="مثال: من أكتوبر إلى أبريل"
                value={form.best_time_to_visit}
                onChange={(e) =>
                  updateForm("best_time_to_visit", e.target.value)
                }
              />
            </InputGroup>

            <div className="md:col-span-2">
              <InputGroup label="وصف مختصر للكارت" hint="يظهر في كارت الرحلة">
                <textarea
                  className="admin-textarea"
                  placeholder="اكتب وصف قصير يظهر في الكارت..."
                  value={form.description}
                  onChange={(e) => updateForm("description", e.target.value)}
                />
              </InputGroup>
            </div>

            <div className="md:col-span-2">
              <InputGroup label="نبذة تفصيلية" hint="تظهر في صفحة تفاصيل المحافظة">
                <textarea
                  className="admin-textarea min-h-[150px]"
                  placeholder="اكتب نبذة عن المحافظة..."
                  value={form.overview}
                  onChange={(e) => updateForm("overview", e.target.value)}
                />
              </InputGroup>
            </div>

            <div className="md:col-span-2">
              <InputGroup
                label="أشهر المعالم"
                hint="اكتبي المعالم مفصولة بفواصل. مثال: معبد الكرنك, وادي الملوك"
              >
                <input
                  className="admin-input"
                  placeholder="معبد الكرنك, وادي الملوك, معبد الأقصر"
                  value={form.landmarks}
                  onChange={(e) => updateForm("landmarks", e.target.value)}
                />

                {landmarksList.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {landmarksList.map((item) => (
                      <span
                        key={item}
                        className="rounded-full bg-[#f5ead2] px-3 py-1 text-xs font-black text-[#8f6f2a]"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                )}
              </InputGroup>
            </div>

            <FileUploadBox
              title="صورة الكارت"
              hint="الصورة الصغيرة التي تظهر في صفحة الرحلات"
              file={image}
              preview={imagePreview}
              onChange={setImage}
            />

            <FileUploadBox
              title="صورة الغلاف"
              hint="الصورة الكبيرة داخل صفحة تفاصيل المحافظة"
              file={cover}
              preview={coverPreview}
              onChange={setCover}
            />

            <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-[#ead7ad] bg-[#fcfaf6] px-5 py-4 font-bold text-[#06142b] md:col-span-2">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(e) => updateForm("is_active", e.target.checked)}
                className="mt-1"
              />
              <span>
                المحافظة مفعّلة وتظهر للعميل
                <small className="mt-1 block text-xs font-bold leading-6 text-[#667085]">
                  لو شيلتي العلامة، المحافظة هتتخزن بس مش هتظهر في الموقع.
                </small>
              </span>
            </label>

            <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-[#ead7ad] bg-[#fcfaf6] px-5 py-4 font-bold text-[#06142b] md:col-span-2">
              <input
                type="checkbox"
                checked={form.is_featured}
                onChange={(e) => updateForm("is_featured", e.target.checked)}
                className="mt-1"
              />
              <span>
                محافظة مميزة
                <small className="mt-1 block text-xs font-bold leading-6 text-[#667085]">
                  استخدميها لو حبيتي تميزي محافظة معينة في العرض.
                </small>
              </span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-6 inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-full bg-[#c99b2e] px-8 py-4 font-black text-white shadow-lg shadow-[#c99b2e]/20 transition hover:-translate-y-1 hover:bg-[#b88a22] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <CheckCircle2 size={20} />
            )}
            {loading ? "جاري الإضافة..." : "إضافة المحافظة"}
          </button>
        </form>

        <aside className="space-y-6">
          <div className="rounded-[28px] border border-[#ead7ad] bg-white p-5 shadow-sm sm:rounded-[30px] sm:p-6">
            <div className="mb-5 flex items-center gap-3">
              <Sparkles className="text-[#c99b2e]" />
              <div>
                <h3 className="text-xl font-black text-[#06142b]">
                  معاينة الكارت
                </h3>
                <p className="text-xs font-bold text-[#667085]">
                  شكل تقريبي للكارت في صفحة الرحلات.
                </p>
              </div>
            </div>

            <div className="overflow-hidden rounded-[28px] border border-[#eadfca] bg-white shadow-[0_20px_70px_rgba(0,0,0,0.08)]">
              <div className="relative h-[230px] overflow-hidden bg-[#f5ead2]">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-[#c99b2e]">
                    <ImageIcon size={48} />
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent" />

                <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
                  {form.price && (
                    <span className="rounded-full border border-white/40 bg-black/55 px-4 py-2 text-xs font-black text-white backdrop-blur-md">
                      {Number(form.price || 0).toLocaleString()} جنيه ✦
                    </span>
                  )}

                  {form.badge && (
                    <span className="rounded-full border border-white/40 bg-black/55 px-4 py-2 text-xs font-black text-white backdrop-blur-md">
                      {form.badge}
                    </span>
                  )}
                </div>
              </div>

              <div className="p-5">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <span className="rounded-full bg-[#f7f0e6] px-4 py-2 text-sm font-black text-[#8f6f2a]">
                    ⭐ {form.rating || "4.5"}
                  </span>

                  <span className="flex items-center gap-1 text-sm font-bold text-slate-500">
                    {form.location || "مصر"}
                    <MapPin size={16} className="text-[#d4af37]" />
                  </span>
                </div>

                <h4 className="text-2xl font-black text-[#06142b]">
                  {form.name || "اسم المحافظة"}
                </h4>

                <p className="mt-3 min-h-[56px] text-sm font-bold leading-7 text-slate-500">
                  {form.description || "وصف مختصر للرحلة يظهر هنا."}
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {[form.category, "رحلة داخلية", "TAUI"].map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-[#e8dfcf] bg-white px-3 py-1 text-xs font-bold text-slate-500"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <span className="rounded-full bg-[#d4af37] px-6 py-3 text-sm font-black text-white">
                    عرض التفاصيل
                  </span>

                  <span className="flex items-center gap-1 text-sm font-bold text-slate-500">
                    {form.days || 1} أيام
                    <CalendarDays size={16} className="text-[#d4af37]" />
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-[#ead7ad] bg-[#06142b] p-6 text-white shadow-sm">
            <h3 className="text-xl font-black text-[#f4c542]">
              ملاحظات مهمة
            </h3>
            <ul className="mt-4 space-y-3 text-sm font-bold leading-7 text-white/80">
              <li>• صورة الكارت تظهر في صفحة الرحلات.</li>
              <li>• صورة الغلاف تظهر في صفحة تفاصيل المحافظة.</li>
              <li>• المعالم لازم تكون مفصولة بفاصلة.</li>
              <li>• السعر والأيام يظهروا للعميل في الكارت.</li>
            </ul>
          </div>
        </aside>
      </section>

      <style jsx global>{`
        .admin-input {
          width: 100%;
          min-height: 56px;
          border-radius: 18px;
          border: 1px solid #ead7ad;
          background: #fcfaf6;
          padding: 14px 18px;
          font-weight: 800;
          color: #06142b;
          outline: none;
          transition: 0.2s ease;
        }

        .admin-textarea {
          width: 100%;
          min-height: 110px;
          border-radius: 18px;
          border: 1px solid #ead7ad;
          background: #fcfaf6;
          padding: 14px 18px;
          font-weight: 800;
          color: #06142b;
          outline: none;
          transition: 0.2s ease;
          resize: vertical;
        }

        .admin-input:focus,
        .admin-textarea:focus {
          border-color: #c99b2e;
          box-shadow: 0 0 0 3px rgba(201, 155, 46, 0.13);
        }
      `}</style>
    </main>
  );
}

function InputGroup({
  label,
  hint,
  children,
}: {
  label: string;
  hint: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-black text-[#06142b]">
        {label}
      </label>

      {children}

      <p className="mt-2 text-xs font-bold leading-5 text-[#667085]">
        {hint}
      </p>
    </div>
  );
}

function FileUploadBox({
  title,
  hint,
  file,
  preview,
  onChange,
}: {
  title: string;
  hint: string;
  file: File | null;
  preview: string | null;
  onChange: (file: File | null) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-black text-[#06142b]">
        {title}
      </label>

      <label className="flex min-h-[180px] cursor-pointer flex-col items-center justify-center rounded-[24px] border border-dashed border-[#c99b2e] bg-[#fcfaf6] p-5 text-center transition hover:bg-[#fff7e5]">
        {preview ? (
          <img
            src={preview}
            alt={title}
            className="mb-3 h-24 w-full rounded-2xl object-cover"
          />
        ) : (
          <UploadCloud className="mb-3 text-[#c99b2e]" size={36} />
        )}

        <p className="text-sm font-black text-[#06142b]">
          {file ? file.name : "اختيار ملف"}
        </p>

        <p className="mt-1 text-xs font-bold text-[#667085]">{hint}</p>

        <input
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => onChange(e.target.files?.[0] || null)}
        />
      </label>
    </div>
  );
}
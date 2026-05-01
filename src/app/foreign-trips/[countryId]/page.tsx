"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import axios from "@/lib/axios";
import { useLanguage } from "@/context/language-context";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  FileText,
  Globe2,
  Loader2,
  Mail,
  Phone,
  Send,
  UploadCloud,
  User,
} from "lucide-react";

type TravelField = {
  id: number;
  travel_country_id: number;
  label: string;
  name: string;
  type: "text" | "email" | "phone" | "date" | "select" | "file" | "textarea";
  options: string[] | null;
  is_required: boolean;
  sort_order: number;
};

type TravelCountry = {
  id: number;
  name: string;
  slug: string;
  image: string | null;
  is_active: boolean;
  fields: TravelField[];
};

async function getTravelForm(countryId: string) {
  const res = await axios.get(`/travel-form/${countryId}`);
  return res.data.country as TravelCountry;
}

async function submitTravelForm(formData: FormData) {
  const res = await axios.post("/travel-submit", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
}

function getFieldIcon(type: TravelField["type"]) {
  if (type === "email") return Mail;
  if (type === "phone") return Phone;
  if (type === "date") return CalendarDays;
  if (type === "file") return UploadCloud;
  if (type === "textarea") return FileText;
  return User;
}

export default function ForeignTripFormPage() {
  const params = useParams();
  const router = useRouter();
  const { lang, t } = useLanguage();

  const text = t.common.foreignTripFormPage;
  const isAr = lang === "ar";
  const BackIcon = isAr ? ArrowRight : ArrowLeft;

  const countryId = String(params.countryId);

  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [files, setFiles] = useState<Record<string, File | null>>({});

  const { data: country, isLoading } = useQuery({
    queryKey: ["travel-form", countryId],
    queryFn: () => getTravelForm(countryId),
    enabled: Boolean(countryId),
  });

  const sortedFields = useMemo(() => {
    return [...(country?.fields || [])].sort(
      (a, b) => a.sort_order - b.sort_order
    );
  }, [country]);

  const submitMutation = useMutation({
    mutationFn: submitTravelForm,
    onSuccess: () => {
      Swal.fire({
        icon: "success",
        title: text.alerts.successTitle,
        text: text.alerts.successText,
        confirmButtonColor: "#c99b2e",
      });

      router.push("/dashboard");
    },
    onError: () => {
      Swal.fire({
        icon: "error",
        title: text.alerts.errorTitle,
        text: text.alerts.errorText,
        confirmButtonColor: "#c99b2e",
      });
    },
  });

  const handleChange = (name: string, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (name: string, file: File | null) => {
    setFiles((prev) => ({
      ...prev,
      [name]: file,
    }));
  };

  const validateForm = () => {
    for (const field of sortedFields) {
      if (!field.is_required) continue;

      if (field.type === "file") {
        if (!files[field.name]) {
          Swal.fire({
            icon: "warning",
            title: `${text.alerts.uploadRequired} ${field.label}`,
            confirmButtonColor: "#c99b2e",
          });
          return false;
        }
      } else if (!answers[field.name]?.trim()) {
        Swal.fire({
          icon: "warning",
          title: `${text.alerts.fieldRequired} ${field.label}`,
          confirmButtonColor: "#c99b2e",
        });
        return false;
      }
    }

    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!country) return;
    if (!validateForm()) return;

    const formData = new FormData();

    formData.append("travel_country_id", String(country.id));

    sortedFields.forEach((field) => {
      if (field.type === "file") {
        const file = files[field.name];

        if (file) {
          formData.append(`answers[${field.name}]`, file);
        }
      } else {
        formData.append(`answers[${field.name}]`, answers[field.name] || "");
      }
    });

    submitMutation.mutate(formData);
  };

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#fcfaf6] px-4">
        <div className="flex flex-col items-center gap-4">
          <div className="h-14 w-14 animate-spin rounded-full border-4 border-[#f5ead2] border-t-[#c99b2e]" />
          <p className="text-center font-black text-[#667085]">
            {text.loading}
          </p>
        </div>
      </main>
    );
  }

  if (!country) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#fcfaf6] p-6">
        <div className="rounded-[30px] border border-[#ead7ad] bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-black text-[#06142b]">
            {text.notFound.title}
          </h1>

          <button
            type="button"
            onClick={() => router.back()}
            className="mt-5 rounded-full bg-[#c99b2e] px-6 py-3 font-black text-white transition hover:bg-[#b88a22]"
          >
            {text.common.back}
          </button>
        </div>
      </main>
    );
  }

  return (
    <main
      dir={isAr ? "rtl" : "ltr"}
      className="min-h-screen bg-[#fcfaf6] px-3 py-6 sm:px-6 sm:py-8 lg:px-12"
    >
      <section className="mx-auto max-w-6xl space-y-6 sm:space-y-8">
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 rounded-full border border-[#ead7ad] bg-white px-5 py-3 text-sm font-black text-[#06142b] transition hover:bg-[#f5ead2]"
        >
          <BackIcon size={18} />
          {text.common.back}
        </button>

        <div className="relative overflow-hidden rounded-[28px] border border-[#ead7ad] bg-gradient-to-l from-[#06142b] via-[#13294b] to-[#c99b2e] p-5 text-white shadow-xl sm:rounded-[38px] sm:p-10">
          <div className="absolute -left-20 -top-20 h-80 w-80 rounded-full bg-white/10 blur-3xl" />

          <div className="relative z-10 max-w-3xl">
            <span className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/15 px-5 py-2 text-sm font-black text-[#f4c542]">
              <Globe2 size={17} />
              {text.hero.badge}
            </span>

            <h1 className="break-words text-3xl font-black leading-tight sm:text-5xl">
              {text.hero.title} {country.name}
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/80 sm:text-base sm:leading-8">
              {text.hero.description}
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid gap-6 lg:grid-cols-[1fr_340px] lg:gap-8"
        >
          <div className="rounded-[28px] border border-[#ead7ad] bg-white p-5 shadow-sm sm:rounded-[32px] sm:p-7">
            <div className="mb-6">
              <h2 className="text-2xl font-black text-[#06142b]">
                {text.form.title}
              </h2>

              <p className="mt-2 text-sm font-bold leading-7 text-[#667085]">
                {text.form.requiredHint}
              </p>
            </div>

            {sortedFields.length === 0 ? (
              <div className="rounded-[26px] border border-dashed border-[#ead7ad] bg-[#fcfaf6] p-8 text-center sm:p-10">
                <p className="font-black text-[#667085]">
                  {text.form.empty}
                </p>
              </div>
            ) : (
              <div className="grid gap-5 md:grid-cols-2">
                {sortedFields.map((field) => {
                  const Icon = getFieldIcon(field.type);

                  return (
                    <div
                      key={field.id}
                      className={
                        field.type === "textarea" || field.type === "file"
                          ? "md:col-span-2"
                          : ""
                      }
                    >
                      <label className="mb-2 flex items-center gap-2 text-sm font-black text-[#06142b]">
                        <Icon size={17} className="shrink-0 text-[#c99b2e]" />
                        <span className="break-words">{field.label}</span>
                        {field.is_required && (
                          <span className="text-red-500">*</span>
                        )}
                      </label>

                      {field.type === "select" ? (
                        <select
                          value={answers[field.name] || ""}
                          onChange={(e) =>
                            handleChange(field.name, e.target.value)
                          }
                          className="h-14 w-full rounded-2xl border border-[#ead7ad] bg-[#fcfaf6] px-4 font-bold text-[#06142b] outline-none transition focus:border-[#c99b2e]"
                        >
                          <option value="">{text.form.selectPlaceholder}</option>

                          {field.options?.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      ) : field.type === "textarea" ? (
                        <textarea
                          value={answers[field.name] || ""}
                          onChange={(e) =>
                            handleChange(field.name, e.target.value)
                          }
                          className="min-h-32 w-full rounded-2xl border border-[#ead7ad] bg-[#fcfaf6] px-4 py-3 font-bold text-[#06142b] outline-none transition focus:border-[#c99b2e]"
                          placeholder={field.label}
                        />
                      ) : field.type === "file" ? (
                        <label className="block cursor-pointer rounded-3xl border-2 border-dashed border-[#c99b2e]/50 bg-[#fffaf0] p-5 text-center transition hover:bg-[#f5ead2] sm:p-6">
                          <UploadCloud
                            size={32}
                            className="mx-auto mb-3 text-[#c99b2e]"
                          />

                          <p className="break-words font-black text-[#06142b]">
                            {files[field.name]
                              ? files[field.name]?.name
                              : text.form.fileDrop}
                          </p>

                          <p className="mt-1 text-sm font-bold text-[#667085]">
                            {text.form.fileSelect}
                          </p>

                          <input
                            type="file"
                            className="hidden"
                            onChange={(e) =>
                              handleFileChange(
                                field.name,
                                e.target.files?.[0] || null
                              )
                            }
                          />
                        </label>
                      ) : (
                        <input
                          type={
                            field.type === "phone"
                              ? "tel"
                              : field.type === "email"
                              ? "email"
                              : field.type === "date"
                              ? "date"
                              : "text"
                          }
                          value={answers[field.name] || ""}
                          onChange={(e) =>
                            handleChange(field.name, e.target.value)
                          }
                          className="h-14 w-full rounded-2xl border border-[#ead7ad] bg-[#fcfaf6] px-4 font-bold text-[#06142b] outline-none transition focus:border-[#c99b2e]"
                          placeholder={field.label}
                          dir={
                            field.type === "email" || field.type === "phone"
                              ? "ltr"
                              : isAr
                              ? "rtl"
                              : "ltr"
                          }
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <aside className="h-fit rounded-[28px] border border-[#ead7ad] bg-white p-5 shadow-sm sm:rounded-[32px] sm:p-6 lg:sticky lg:top-8">
            <div className="mb-5 rounded-[26px] bg-[#fffaf0] p-5">
              <h3 className="text-xl font-black text-[#06142b]">
                {text.summary.title}
              </h3>

              <div className="mt-4 space-y-3 text-sm font-bold text-[#667085]">
                <div className="flex items-center justify-between gap-4">
                  <span>{text.summary.country}</span>
                  <span className="break-words text-[#06142b]">
                    {country.name}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span>{text.summary.fieldsCount}</span>
                  <span className="text-[#06142b]">{sortedFields.length}</span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span>{text.summary.requiredFields}</span>
                  <span className="text-[#06142b]">
                    {sortedFields.filter((field) => field.is_required).length}
                  </span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitMutation.isPending || sortedFields.length === 0}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-[#c99b2e] px-6 py-4 font-black text-white transition hover:-translate-y-1 hover:bg-[#b88a22] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitMutation.isPending ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  {text.form.submitting}
                </>
              ) : (
                <>
                  <Send size={18} />
                  {text.form.submit}
                </>
              )}
            </button>

            <div className="mt-5 flex items-start gap-2 rounded-2xl bg-green-50 p-4 text-sm font-bold leading-6 text-green-700">
              <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
              {text.summary.reviewNote}
            </div>
          </aside>
        </form>
      </section>
    </main>
  );
}
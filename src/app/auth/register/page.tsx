"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "../../../lib/axios";
import { useAuth } from "../../../context/auth-context";
import { useLanguage } from "@/context/language-context";

export default function RegisterPage() {
  const router = useRouter();
  const { refreshUser } = useAuth();
  const { lang, t } = useLanguage();

  const registerText = t.auth.registerPage;
  const isAr = lang === "ar";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await axios.post("/register", {
        name,
        email,
        password,
      });

      await refreshUser();
      router.push("/");
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.errors?.email?.[0] ||
          registerText.errors.registerFailed
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      dir={isAr ? "rtl" : "ltr"}
      className="flex min-h-screen items-center justify-center bg-[#f7efe2] px-4 py-10"
    >
      <div className="grid w-full max-w-6xl grid-cols-1 overflow-hidden rounded-[28px] border border-[#e8d8b8] bg-white shadow-2xl sm:rounded-[32px] lg:grid-cols-2">
        <section className="p-6 sm:p-8 md:p-12">
          <div className="mb-8 sm:mb-10">
            <span className="mb-4 inline-block rounded-full bg-[#f5ead2] px-5 py-2 text-sm font-bold text-[#b99024]">
              Taui Traveling
            </span>

            <h1 className="text-3xl font-black leading-tight text-[#06142b] sm:text-4xl md:text-5xl">
              {registerText.title}
            </h1>

            <p className="mt-4 text-base leading-7 text-[#667085] sm:text-lg">
              {registerText.description}
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-5">
            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-bold text-red-600">
                {error}
              </div>
            )}

            <div>
              <label className="mb-2 block font-bold text-[#344054]">
                {registerText.form.name}
              </label>

              <input
                type="text"
                placeholder={registerText.form.namePlaceholder}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="h-14 w-full rounded-2xl border border-[#e5d8bd] bg-white px-5 text-[#06142b] outline-none transition focus:border-[#d4a82f] focus:ring-4 focus:ring-[#d4a82f]/20"
              />
            </div>

            <div>
              <label className="mb-2 block font-bold text-[#344054]">
                {registerText.form.email}
              </label>

              <input
                type="email"
                placeholder="example@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                dir="ltr"
                className="h-14 w-full rounded-2xl border border-[#e5d8bd] bg-white px-5 text-[#06142b] outline-none transition focus:border-[#d4a82f] focus:ring-4 focus:ring-[#d4a82f]/20"
              />
            </div>

            <div>
              <label className="mb-2 block font-bold text-[#344054]">
                {registerText.form.password}
              </label>

              <input
                type="password"
                placeholder={registerText.form.passwordPlaceholder}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="h-14 w-full rounded-2xl border border-[#e5d8bd] bg-white px-5 text-[#06142b] outline-none transition focus:border-[#d4a82f] focus:ring-4 focus:ring-[#d4a82f]/20"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="h-14 w-full rounded-2xl bg-[#d4a82f] text-base font-black text-white shadow-lg shadow-[#d4a82f]/30 transition hover:bg-[#b99024] disabled:cursor-not-allowed disabled:opacity-60 sm:text-lg"
            >
              {loading
                ? registerText.form.submitting
                : registerText.form.submit}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-[#667085] sm:text-base">
            {registerText.loginPrompt}{" "}
            <button
              type="button"
              onClick={() => router.push("/auth/login")}
              className="font-black text-[#b99024] hover:underline"
            >
              {registerText.loginButton}
            </button>
          </div>
        </section>

        <section className="relative hidden items-center justify-center overflow-hidden bg-[#06142b] p-10 lg:flex xl:p-12">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-45"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1539768942893-daf53e448371?q=80&w=1200&auto=format&fit=crop')",
            }}
          />

          <div className="absolute inset-0 bg-gradient-to-br from-[#06142b] via-[#06142b]/85 to-[#d4a82f]/45" />

          <div className="relative z-10 text-center text-white">
            <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full border border-white/20 bg-white/10 text-3xl font-black text-[#f4c542]">
              TA
            </div>

            <h2 className="text-4xl font-black leading-tight xl:text-5xl">
              {registerText.side.title}
            </h2>

            <p className="mt-6 text-lg leading-relaxed text-white/80 xl:text-xl">
              {registerText.side.description}
            </p>

            <div className="mt-10 grid grid-cols-3 gap-4">
              <div className="rounded-2xl border border-white/15 bg-white/10 p-4">
                <div className="text-2xl font-black text-[#f4c542]">14</div>
                <div className="text-sm text-white/70">
                  {registerText.side.stats.maxDays}
                </div>
              </div>

              <div className="rounded-2xl border border-white/15 bg-white/10 p-4">
                <div className="text-2xl font-black text-[#f4c542]">30</div>
                <div className="text-sm text-white/70">
                  {registerText.side.stats.pointsPerTrip}
                </div>
              </div>

              <div className="rounded-2xl border border-white/15 bg-white/10 p-4">
                <div className="text-2xl font-black text-[#f4c542]">VIP</div>
                <div className="text-sm text-white/70">
                  {registerText.side.stats.vip}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import {
  BarChart3,
  CheckCircle,
  Clock,
  CreditCard,
  Crown,
  Globe2,
  LayoutDashboard,
  MapPinned,
  Plane,
  Sparkles,
  Users,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { getAnalytics } from "@/lib/api/analytics";
import { useAuth } from "@/context/auth-context";
import { useLanguage } from "@/context/language-context";

export default function AnalyticsPage() {
  const { user, loading: authLoading } = useAuth();
  const { lang, t } = useLanguage();

  const isAr = lang === "ar";
  const analyticsText = t.admin.analyticsPage;

  const isAdmin = user?.role?.trim().toLowerCase() === "admin";

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-analytics"],
    queryFn: getAnalytics,
    enabled: !!user && isAdmin,
  });

  useEffect(() => {
    if (error) {
      Swal.fire({
        icon: "error",
        title: analyticsText.alerts.errorTitle,
        text: analyticsText.alerts.errorText,
        confirmButtonColor: "#c99b2e",
      });
    }
  }, [error, analyticsText.alerts.errorTitle, analyticsText.alerts.errorText]);

  if (authLoading || isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#fbf7ef] px-4">
        <div className="rounded-3xl border border-[#ead7ad] bg-white px-6 py-5 text-center font-black text-[#06142b] shadow-sm sm:px-8 sm:py-6">
          {analyticsText.loading}
        </div>
      </main>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  if (!data) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#fbf7ef] px-4">
        <div className="rounded-3xl border border-[#ead7ad] bg-white px-6 py-5 text-center font-black text-[#06142b] shadow-sm sm:px-8 sm:py-6">
          {analyticsText.empty}
        </div>
      </main>
    );
  }

  const totalTrips = data.cards.internal_trips + data.cards.foreign_trips;

  const statusChartData = [
    {
      name: analyticsText.status.underReview,
      value: data.requests_by_status.under_review || 0,
      color: "#f59e0b",
    },
    {
      name: analyticsText.status.designed,
      value: data.requests_by_status.designed || 0,
      color: "#3b82f6",
    },
    {
      name: analyticsText.status.completed,
      value: data.requests_by_status.completed || 0,
      color: "#22c55e",
    },
    {
      name: analyticsText.status.rejected,
      value: data.requests_by_status.rejected || 0,
      color: "#ef4444",
    },
  ];

  const typeChartData = [
    {
      name: analyticsText.tripTypes.internal,
      value: data.requests_by_type.internal || 0,
    },
    {
      name: analyticsText.tripTypes.foreign,
      value: data.requests_by_type.foreign || 0,
    },
  ];

  return (
    <main
      dir={isAr ? "rtl" : "ltr"}
      className="min-h-screen bg-[#fbf7ef] px-3 py-6 sm:px-6 sm:py-8 lg:px-8"
    >
      <section className="mx-auto max-w-[1400px]">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="relative mb-6 overflow-hidden rounded-[28px] border border-[#ead7ad] bg-gradient-to-l from-[#f3e7c9] via-white to-[#fffaf0] p-5 shadow-sm sm:mb-8 sm:rounded-[34px] sm:p-8 lg:p-10"
        >
          <div className="absolute left-0 top-0 h-full w-1/2 bg-gradient-to-r from-[#c99b2e]/20 to-transparent" />

          <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#c99b2e]/30 bg-white/80 px-4 py-2 text-xs font-black text-[#c99b2e] sm:px-5 sm:text-sm">
                <BarChart3 size={17} />
                {analyticsText.hero.badge}
              </span>

              <h1 className="text-2xl font-black text-[#06142b] sm:text-4xl lg:text-5xl">
                {analyticsText.hero.title}
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-[#667085] sm:text-base sm:leading-8">
                {analyticsText.hero.description}
              </p>
            </div>

            <div className="w-full rounded-[24px] border border-[#ead7ad] bg-white/80 p-5 text-center shadow-sm sm:w-auto sm:rounded-[26px]">
              <Sparkles className="mx-auto mb-3 text-[#c99b2e]" size={28} />

              <p className="text-sm font-bold text-[#667085]">
                {analyticsText.hero.totalTrips}
              </p>

              <h2 className="mt-1 text-4xl font-black text-[#06142b]">
                {totalTrips}
              </h2>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 gap-4 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          <Stat
            label={analyticsText.cards.users}
            value={data.cards.total_users}
            icon={<Users />}
            delay={0.05}
          />

          <Stat
            label={analyticsText.cards.internalTrips}
            value={data.cards.internal_trips}
            icon={<Plane />}
            delay={0.1}
          />

          <Stat
            label={analyticsText.cards.foreignTrips}
            value={data.cards.foreign_trips}
            icon={<Globe2 />}
            delay={0.15}
          />

          <Stat
            label={analyticsText.cards.underReview}
            value={data.cards.under_review_trips}
            icon={<Clock />}
            delay={0.2}
          />

          <Stat
            label={analyticsText.cards.completed}
            value={data.cards.completed_trips}
            icon={<CheckCircle />}
            delay={0.25}
          />

          <Stat
            label={analyticsText.cards.acceptedPayments}
            value={data.cards.accepted_payments_total}
            icon={<CreditCard />}
            delay={0.3}
          />
        </div>

        <div className="mt-6 grid gap-6 xl:mt-8 xl:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.35 }}
            className="rounded-[26px] border border-[#ead7ad] bg-white p-4 shadow-sm sm:rounded-[30px] sm:p-6"
          >
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-[#06142b] sm:text-2xl">
                  {analyticsText.statusChart.title}
                </h2>

                <p className="mt-2 text-sm font-bold text-[#667085]">
                  {analyticsText.statusChart.description}
                </p>
              </div>

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#f5ead2] text-[#c99b2e] sm:h-12 sm:w-12">
                <LayoutDashboard />
              </div>
            </div>

            <div className="h-[280px] sm:h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusChartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={95}
                    innerRadius={54}
                    paddingAngle={4}
                  >
                    {statusChartData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>

                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {statusChartData.map((item) => (
                <div
                  key={item.name}
                  className="rounded-2xl border border-[#ead7ad] bg-[#fcfaf6] p-3"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="h-3 w-3 shrink-0 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />

                    <p className="text-xs font-black text-[#667085]">
                      {item.name}
                    </p>
                  </div>

                  <p className="mt-2 text-2xl font-black text-[#06142b]">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.45 }}
            className="rounded-[26px] border border-[#ead7ad] bg-white p-4 shadow-sm sm:rounded-[30px] sm:p-6"
          >
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-[#06142b] sm:text-2xl">
                  {analyticsText.typeChart.title}
                </h2>

                <p className="mt-2 text-sm font-bold text-[#667085]">
                  {analyticsText.typeChart.description}
                </p>
              </div>

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#f5ead2] text-[#c99b2e] sm:h-12 sm:w-12">
                <BarChart3 />
              </div>
            </div>

            <div className="h-[280px] sm:h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={typeChartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="value" radius={[14, 14, 0, 0]} fill="#c99b2e" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        <div className="mt-6 grid gap-6 lg:mt-8 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.55 }}
            className="rounded-[26px] border border-[#ead7ad] bg-white p-4 shadow-sm sm:rounded-[30px] sm:p-6"
          >
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#f5ead2] text-[#c99b2e] sm:h-12 sm:w-12">
                <MapPinned />
              </div>

              <div>
                <h2 className="text-xl font-black text-[#06142b] sm:text-2xl">
                  {analyticsText.destinations.title}
                </h2>

                <p className="mt-1 text-sm font-bold text-[#667085]">
                  {analyticsText.destinations.description}
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <InfoBox
                label={analyticsText.destinations.mostTravelled}
                value={data.destinations.most_travelled?.destination || "-"}
                count={data.destinations.most_travelled?.total || 0}
                countLabel={analyticsText.common.requestsCount}
              />

              <InfoBox
                label={analyticsText.destinations.leastTravelled}
                value={data.destinations.least_travelled?.destination || "-"}
                count={data.destinations.least_travelled?.total || 0}
                countLabel={analyticsText.common.requestsCount}
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.65 }}
            className="rounded-[26px] border border-[#ead7ad] bg-white p-4 shadow-sm sm:rounded-[30px] sm:p-6"
          >
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#f5ead2] text-[#c99b2e] sm:h-12 sm:w-12">
                <Crown />
              </div>

              <div>
                <h2 className="text-xl font-black text-[#06142b] sm:text-2xl">
                  {analyticsText.topCustomer.title}
                </h2>

                <p className="mt-1 text-sm font-bold text-[#667085]">
                  {analyticsText.topCustomer.description}
                </p>
              </div>
            </div>

            <div className="rounded-[24px] border border-[#ead7ad] bg-[#fcfaf6] p-5 sm:rounded-[26px]">
              <p className="break-words text-2xl font-black text-[#06142b]">
                {data.top_customer?.user?.name || "-"}
              </p>

              <p className="mt-2 break-all text-sm font-bold text-[#667085]">
                {data.top_customer?.user?.email || analyticsText.topCustomer.noEmail}
              </p>

              <div className="mt-5 inline-flex rounded-full bg-[#c99b2e] px-5 py-2 text-sm font-black text-white">
                {analyticsText.topCustomer.tripsCount}:{" "}
                {data.top_customer?.total || 0}
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}

function Stat({
  label,
  value,
  icon,
  delay,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 26 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -6 }}
      className="rounded-[24px] border border-[#ead7ad] bg-white p-5 shadow-sm transition hover:shadow-md sm:rounded-[26px]"
    >
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f5ead2] text-[#c99b2e]">
        {icon}
      </div>

      <p className="text-sm font-bold text-[#667085]">{label}</p>

      <h3 className="mt-2 text-3xl font-black text-[#06142b] sm:text-4xl">
        {value}
      </h3>
    </motion.div>
  );
}

function InfoBox({
  label,
  value,
  count,
  countLabel,
}: {
  label: string;
  value: string;
  count: number;
  countLabel: string;
}) {
  return (
    <div className="rounded-[24px] border border-[#ead7ad] bg-[#fcfaf6] p-5 transition hover:-translate-y-1 hover:shadow-md sm:rounded-[26px]">
      <p className="text-sm font-black text-[#c99b2e]">{label}</p>

      <h3 className="mt-3 break-words text-2xl font-black text-[#06142b]">
        {value}
      </h3>

      <div className="mt-5 inline-flex rounded-full bg-white px-4 py-2 text-sm font-black text-[#06142b] shadow-sm">
        {countLabel}: {count}
      </div>
    </div>
  );
}
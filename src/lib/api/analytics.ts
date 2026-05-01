import axios from "@/lib/axios";

export type AnalyticsData = {
  cards: {
    total_users: number;
    internal_trips: number;
    foreign_trips: number;
    under_review_trips: number;
    completed_trips: number;
    accepted_payments_total: number;
  };
  destinations: {
    most_travelled: {
      destination: string;
      total: number;
    } | null;
    least_travelled: {
      destination: string;
      total: number;
    } | null;
  };
  top_customer: {
    total: number;
    user: {
      name: string;
      email: string;
    };
  } | null;
  requests_by_status: Record<string, number>;
  requests_by_type: {
    internal: number;
    foreign: number;
  };
};

export const getAnalytics = async (): Promise<AnalyticsData> => {
  const res = await axios.get("/admin/analytics");
  return res.data;
};
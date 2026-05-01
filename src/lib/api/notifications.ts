import axios from "@/lib/axios";

export type AppNotification = {
  id: number;
  title: string;
  message: string;

  title_ar?: string | null;
  title_en?: string | null;
  message_ar?: string | null;
  message_en?: string | null;

  type: string | null;
  url: string | null;
  read_at: string | null;
  created_at: string;
};

export const getNotifications = async (lang: "ar" | "en" = "ar") => {
  const res = await axios.get("/notifications", {
    params: {
      lang,
    },
    headers: {
      "X-Language": lang,
    },
  });

  return res.data as {
    notifications: AppNotification[];
    unread_count: number;
  };
};

export const markNotificationAsRead = async (id: number) => {
  const res = await axios.post(`/notifications/${id}/read`);
  return res.data;
};

export const markAllNotificationsAsRead = async () => {
  const res = await axios.post("/notifications/read-all");
  return res.data;
};
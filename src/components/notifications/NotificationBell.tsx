"use client";

import { useState } from "react";
import Link from "next/link";
import { Bell } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "@/lib/api/notifications";
import { useLanguage } from "@/context/language-context";

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const { lang, t } = useLanguage();

  const notificationsText = t.common.notifications;
  const isAr = lang === "ar";
  const locale = isAr ? "ar-EG" : "en-US";

  const { data } = useQuery({
    queryKey: ["notifications", lang],
    queryFn: () => getNotifications(lang),
    refetchInterval: 15000,
  });

  const notifications = data?.notifications || [];
  const unreadCount = data?.unread_count || 0;

  const getNotificationTitle = (notification: any) => {
    if (isAr) {
      return notification.title_ar || notification.title || notification.title_en;
    }

    return notification.title_en || notification.title || notification.title_ar;
  };

  const getNotificationMessage = (notification: any) => {
    if (isAr) {
      return notification.message_ar || notification.message || notification.message_en;
    }

    return notification.message_en || notification.message || notification.message_ar;
  };

  const markOne = useMutation({
    mutationFn: markNotificationAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const markAll = useMutation({
    mutationFn: markAllNotificationsAsRead,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["notifications", lang] });

      const previousData = queryClient.getQueryData(["notifications", lang]);

      queryClient.setQueryData(["notifications", lang], (oldData: any) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          unread_count: 0,
          notifications: (oldData.notifications || []).map((notification: any) => ({
            ...notification,
            read_at: notification.read_at || new Date().toISOString(),
          })),
        };
      });

      return { previousData };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(["notifications", lang], context.previousData);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const handleToggleOpen = () => {
    const nextOpen = !open;

    setOpen(nextOpen);

    if (nextOpen && unreadCount > 0) {
      markAll.mutate();
    }
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={handleToggleOpen}
        aria-label={notificationsText.open}
        className="relative flex h-11 w-11 items-center justify-center rounded-full border border-[#ead7ad] bg-white text-[#06142b] transition hover:bg-[#f5ead2]"
      >
        <Bell size={20} />

        {unreadCount > 0 && (
          <span
            className={`absolute -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#c99b2e] px-1 text-xs font-black text-white ${
              isAr ? "-left-1" : "-right-1"
            }`}
          >
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div
          dir={isAr ? "rtl" : "ltr"}
          className={`absolute top-14 z-50 w-[320px] overflow-hidden rounded-[24px] border border-[#ead7ad] bg-white shadow-2xl sm:w-[340px] ${
            isAr ? "left-0" : "right-0"
          }`}
        >
          <div className="flex items-center justify-between gap-3 border-b border-[#ead7ad] bg-[#fffaf0] p-4">
            <h3 className="font-black text-[#06142b]">
              {notificationsText.title}
            </h3>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={() => markAll.mutate()}
                disabled={markAll.isPending}
                className="text-xs font-black text-[#c99b2e] transition hover:underline disabled:cursor-not-allowed disabled:opacity-50"
              >
                {markAll.isPending
                  ? notificationsText.marking
                  : notificationsText.markAllAsRead}
              </button>
            )}
          </div>

          <div className="max-h-[420px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-6 text-center">
                <p className="font-bold text-[#667085]">
                  {notificationsText.empty}
                </p>
              </div>
            ) : (
              notifications.map((notification: any) => (
                <Link
                  key={notification.id}
                  href={notification.url || "/dashboard"}
                  onClick={() => {
                    if (!notification.read_at) {
                      markOne.mutate(notification.id);
                    }

                    setOpen(false);
                  }}
                  className={`block border-b border-[#f1e4c7] p-4 transition hover:bg-[#fffaf0] ${
                    !notification.read_at ? "bg-[#fff8e8]" : "bg-white"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={`mt-1 h-3 w-3 shrink-0 rounded-full ${
                        !notification.read_at
                          ? "bg-[#c99b2e]"
                          : "bg-[#d8d8d8]"
                      }`}
                    />

                    <div className="min-w-0">
                      <h4 className="break-words font-black text-[#06142b]">
                        {getNotificationTitle(notification)}
                      </h4>

                      <p className="mt-1 break-words text-sm leading-6 text-[#667085]">
                        {getNotificationMessage(notification)}
                      </p>

                      <p className="mt-2 text-xs font-bold text-[#c99b2e]">
                        {new Date(notification.created_at).toLocaleString(
                          locale
                        )}
                      </p>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
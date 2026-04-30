<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    private function getLang(Request $request): string
    {
        $lang = $request->query('lang')
            ?? $request->header('X-Language')
            ?? $request->header('Accept-Language')
            ?? 'ar';

        return str_starts_with(strtolower($lang), 'en') ? 'en' : 'ar';
    }

    private function formatNotification(Notification $notification, string $lang): array
    {
        $titleAr = $notification->title_ar ?? $notification->title;
        $titleEn = $notification->title_en ?? $notification->title ?? $notification->title_ar;

        $messageAr = $notification->message_ar ?? $notification->message;
        $messageEn = $notification->message_en ?? $notification->message ?? $notification->message_ar;

        return [
            'id' => $notification->id,
            'user_id' => $notification->user_id,

            // دول اللي الفرونت بيستخدمهم حاليًا
            'title' => $lang === 'en' ? $titleEn : $titleAr,
            'message' => $lang === 'en' ? $messageEn : $messageAr,

            // دول موجودين لو احتجنا نختار من الفرونت بعدين
            'title_ar' => $titleAr,
            'title_en' => $titleEn,
            'message_ar' => $messageAr,
            'message_en' => $messageEn,

            'type' => $notification->type,
            'url' => $notification->url,
            'read_at' => $notification->read_at,
            'created_at' => $notification->created_at,
            'updated_at' => $notification->updated_at,
        ];
    }

    public function index(Request $request)
    {
        $lang = $this->getLang($request);

        $notifications = Notification::where('user_id', $request->user()->id)
            ->latest()
            ->get()
            ->map(fn ($notification) => $this->formatNotification($notification, $lang))
            ->values();

        $unreadCount = Notification::where('user_id', $request->user()->id)
            ->whereNull('read_at')
            ->count();

        return response()->json([
            'notifications' => $notifications,
            'unread_count' => $unreadCount,
        ]);
    }

    public function markAsRead(Request $request, Notification $notification)
    {
        if ($notification->user_id !== $request->user()->id) {
            return response()->json([
                'message' => 'Unauthorized',
            ], 403);
        }

        $notification->update([
            'read_at' => now(),
        ]);

        return response()->json([
            'message' => 'Notification marked as read',
        ]);
    }

    public function markAllAsRead(Request $request)
    {
        Notification::where('user_id', $request->user()->id)
            ->whereNull('read_at')
            ->update([
                'read_at' => now(),
            ]);

        return response()->json([
            'message' => 'All notifications marked as read',
        ]);
    }
}

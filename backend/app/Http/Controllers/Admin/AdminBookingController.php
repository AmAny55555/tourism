<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\TripDesign;
use App\Models\Notification;
use Illuminate\Http\Request;

class AdminBookingController extends Controller
{
    public function index()
    {
        $bookings = Booking::with(['user:id,name,email', 'design'])
            ->latest()
            ->get();

        return response()->json([
            'bookings' => $bookings,
        ]);
    }

    public function design(Request $request, Booking $booking)
    {
        $validated = $request->validate([
            'hotel_name' => 'required|string|max:255',
            'transport_type' => 'required|string|max:255',
            'total_price' => 'required|numeric|min:0',
            'details' => 'nullable|string|max:5000',
        ]);

        TripDesign::updateOrCreate(
            ['booking_id' => $booking->id],
            $validated
        );

        $booking->update([
            'status' => 'designed',
        ]);

        Notification::create([
            'user_id' => $booking->user_id,

            // القديم نسيبه عشان أي كود قديم مايقعش
            'title' => 'تم تصميم رحلتك ✨',
            'message' => 'تم تجهيز تفاصيل الرحلة الخاصة بك. يمكنك مراجعتها وتأكيدها الآن.',

            // الجديد للترجمة
            'title_ar' => 'تم تصميم رحلتك ✨',
            'title_en' => 'Your trip has been designed ✨',
            'message_ar' => 'تم تجهيز تفاصيل الرحلة الخاصة بك. يمكنك مراجعتها وتأكيدها الآن.',
            'message_en' => 'Your trip details are ready. You can now review and confirm them.',

            'type' => 'trip_designed',
            'url' => '/dashboard',
        ]);

        return response()->json([
            'message' => 'تم تصميم الرحلة بنجاح',
            'booking' => $booking->load(['user:id,name,email', 'design']),
        ]);
    }
}

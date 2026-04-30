<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Notification;
use App\Models\User;
use Illuminate\Http\Request;
use Carbon\Carbon;

class BookingController extends Controller
{
    public function myBookings(Request $request)
    {
        $bookings = Booking::with('design')
            ->where('user_id', $request->user()->id)
            ->latest()
            ->get();

        $totalTrips = $bookings->count();
        $underReview = $bookings->where('status', 'under_review')->count();
        $completedTrips = $bookings->where('status', 'completed')->count();
        $points = $bookings->sum('points_earned');

        return response()->json([
            'bookings' => $bookings,
            'stats' => [
                'total_trips' => $totalTrips,
                'under_review' => $underReview,
                'completed_trips' => $completedTrips,
                'points' => $points,
                'rewards_available' => $points >= 420 ? 1 : 0,
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'destination' => 'required|string|max:255',
            'days_count' => 'required|integer|min:1|max:14',
            'travel_date' => 'required|date|after_or_equal:' . Carbon::now()->addDays(2)->toDateString(),
            'adults_count' => 'required|integer|min:1|max:20',
            'children_count' => 'nullable|integer|min:0|max:20',
            'trip_class' => 'required|in:Economy Class,Premium Economy Class,Business Class,First Class',
            'notes' => 'nullable|string|max:2000',
        ]);

        $booking = Booking::create([
            ...$validated,
            'user_id' => $request->user()->id,
            'children_count' => $validated['children_count'] ?? 0,
            'status' => 'under_review',
            'points_earned' => 0,
        ]);

        $admins = User::where('role', 'admin')->get();

        foreach ($admins as $admin) {
            Notification::create([
                'user_id' => $admin->id,

                'title' => 'طلب رحلة داخلية جديد',
                'message' => 'تم إرسال طلب حجز رحلة داخلية جديد، يرجى مراجعته.',

                'title_ar' => 'طلب رحلة داخلية جديد',
                'title_en' => 'New domestic trip request',
                'message_ar' => 'تم إرسال طلب حجز رحلة داخلية جديد، يرجى مراجعته.',
                'message_en' => 'A new domestic trip booking request has been submitted. Please review it.',

                'type' => 'booking_submitted',
                'url' => '/admin',
            ]);
        }

        return response()->json([
            'message' => 'تم إرسال طلب الحجز بنجاح',
            'booking' => $booking,
        ], 201);
    }
}

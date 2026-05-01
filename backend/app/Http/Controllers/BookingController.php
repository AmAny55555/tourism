<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Notification;
use App\Models\User;
use App\Models\Review;
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

    public function markCompleted(Request $request, Booking $booking)
    {
        if (($request->user()->role ?? 'user') !== 'admin') {
            return response()->json([
                'message' => 'غير مسموح لك بإنهاء هذه الرحلة.',
            ], 403);
        }

        $pointsEarned = $booking->points_earned > 0 ? $booking->points_earned : 30;

        $booking->update([
            'status' => 'completed',
            'points_earned' => $pointsEarned,
        ]);

        Notification::create([
            'user_id' => $booking->user_id,

            'title' => 'تم اكتمال رحلتك',
            'message' => 'رحلتك أصبحت مكتملة الآن، يمكنك تقييم التجربة من لوحة التحكم.',

            'title_ar' => 'تم اكتمال رحلتك',
            'title_en' => 'Your trip is completed',
            'message_ar' => 'رحلتك أصبحت مكتملة الآن، يمكنك تقييم التجربة من لوحة التحكم.',
            'message_en' => 'Your trip is now completed. You can rate your experience from your dashboard.',

            'type' => 'booking_completed',
            'url' => '/dashboard',
        ]);

        return response()->json([
            'message' => 'تم إنهاء الرحلة بنجاح',
            'booking' => $booking,
        ]);
    }

    public function rate(Request $request, Booking $booking)
    {
        if ($booking->user_id !== $request->user()->id) {
            return response()->json([
                'message' => 'غير مسموح لك بتقييم هذه الرحلة.',
            ], 403);
        }

        if ($booking->status !== 'completed') {
            return response()->json([
                'message' => 'لا يمكنك تقييم الرحلة قبل اكتمالها.',
            ], 403);
        }

        $alreadyReviewed = Review::where('booking_id', $booking->id)
            ->where('user_id', $request->user()->id)
            ->exists();

        if ($alreadyReviewed || !is_null($booking->rating)) {
            return response()->json([
                'message' => 'تم تقييم هذه الرحلة من قبل.',
            ], 403);
        }

        $validated = $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'review' => 'nullable|string|max:1000',
            'comment' => 'nullable|string|max:1000',
        ]);

        $comment = $validated['review'] ?? $validated['comment'] ?? null;

        $review = Review::create([
            'user_id' => $request->user()->id,
            'booking_id' => $booking->id,
            'rating' => $validated['rating'],
            'comment' => $comment,
            'is_approved' => true,
        ]);

        $booking->update([
            'rating' => $validated['rating'],
            'review' => $comment,
            'rated_at' => now(),
        ]);

        Notification::create([
            'user_id' => $booking->user_id,

            'title' => 'تم إرسال تقييمك',
            'message' => 'شكرًا لتقييمك الرحلة، رأيك يساعدنا نحسن تجربتك.',

            'title_ar' => 'تم إرسال تقييمك',
            'title_en' => 'Your review has been submitted',
            'message_ar' => 'شكرًا لتقييمك الرحلة، رأيك يساعدنا نحسن تجربتك.',
            'message_en' => 'Thank you for rating your trip. Your feedback helps us improve your experience.',

            'type' => 'booking_rated',
            'url' => '/dashboard',
        ]);

        return response()->json([
            'message' => 'تم إرسال تقييمك بنجاح.',
            'booking' => $booking,
            'review' => $review,
        ]);
    }
}
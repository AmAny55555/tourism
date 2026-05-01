<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Review;
use App\Models\Booking;
use App\Models\ForeignTripRequest;

class ReviewController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'required|string|max:1000',
            'booking_id' => 'nullable|exists:bookings,id',
            'foreign_request_id' => 'nullable|exists:foreign_trip_requests,id',
        ]);

        if (empty($validated['booking_id']) && empty($validated['foreign_request_id'])) {
            return response()->json([
                'message' => 'لازم تختاري رحلة للتقييم.',
            ], 422);
        }

        if (!empty($validated['booking_id']) && !empty($validated['foreign_request_id'])) {
            return response()->json([
                'message' => 'لا يمكن تقييم رحلتين في نفس الطلب.',
            ], 422);
        }

        if (!empty($validated['booking_id'])) {
            return $this->storeBookingReview($request, $validated);
        }

        return $this->storeForeignReview($request, $validated);
    }

    private function storeBookingReview(Request $request, array $validated)
    {
        $booking = Booking::where('id', $validated['booking_id'])
            ->where('user_id', $request->user()->id)
            ->first();

        if (!$booking) {
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

        $review = Review::create([
            'user_id' => $request->user()->id,
            'booking_id' => $booking->id,
            'foreign_request_id' => null,
            'rating' => $validated['rating'],
            'comment' => $validated['comment'],
            'is_approved' => true,
        ]);

        $booking->update([
            'rating' => $validated['rating'],
            'review' => $validated['comment'],
            'rated_at' => now(),
        ]);

        return response()->json([
            'message' => 'تم إضافة التقييم',
            'review' => $review,
        ]);
    }

    private function storeForeignReview(Request $request, array $validated)
    {
        $foreignRequest = ForeignTripRequest::where('id', $validated['foreign_request_id'])
            ->where('user_id', $request->user()->id)
            ->first();

        if (!$foreignRequest) {
            return response()->json([
                'message' => 'غير مسموح لك بتقييم هذه الرحلة الخارجية.',
            ], 403);
        }

        if (!in_array($foreignRequest->status, ['completed', 'confirmed', 'approved'])) {
            return response()->json([
                'message' => 'لا يمكنك تقييم الرحلة الخارجية الآن.',
            ], 403);
        }

        $alreadyReviewed = Review::where('foreign_request_id', $foreignRequest->id)
            ->where('user_id', $request->user()->id)
            ->exists();

        if ($alreadyReviewed) {
            return response()->json([
                'message' => 'تم تقييم هذه الرحلة الخارجية من قبل.',
            ], 403);
        }

        $review = Review::create([
            'user_id' => $request->user()->id,
            'booking_id' => null,
            'foreign_request_id' => $foreignRequest->id,
            'rating' => $validated['rating'],
            'comment' => $validated['comment'],
            'is_approved' => true,
        ]);

        return response()->json([
            'message' => 'تم إضافة تقييم الرحلة الخارجية',
            'review' => $review,
        ]);
    }

    public function index()
    {
        $reviews = Review::with('user')
            ->where('is_approved', true)
            ->latest()
            ->take(6)
            ->get();

        return response()->json([
            'reviews' => $reviews,
        ]);
    }
}
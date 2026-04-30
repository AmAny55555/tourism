<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Payment;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    public function show(Request $request, Booking $booking)
    {
        if ($booking->user_id !== $request->user()->id) {
            return response()->json(['message' => 'غير مسموح'], 403);
        }

        $booking->load('design', 'payment');

        return response()->json([
            'booking' => $booking,
        ]);
    }

    public function store(Request $request, Booking $booking)
    {
        if ($booking->user_id !== $request->user()->id) {
            return response()->json(['message' => 'غير مسموح'], 403);
        }

        if ($booking->status !== 'designed') {
            return response()->json([
                'message' => 'لا يمكن الدفع قبل تصميم الرحلة',
            ], 422);
        }

        $validated = $request->validate([
            'method' => 'required|in:vodafone_cash,instapay',
            'transaction_reference' => 'nullable|string|max:255',
            'notes' => 'nullable|string|max:1000',
        ]);

        $payment = Payment::updateOrCreate(
            ['booking_id' => $booking->id],
            [
                'user_id' => $request->user()->id,
                'method' => $validated['method'],
                'transaction_reference' => $validated['transaction_reference'] ?? null,
                'notes' => $validated['notes'] ?? null,
                'status' => 'pending',
            ]
        );

        $booking->update([
            'status' => 'confirmed',
        ]);

        return response()->json([
            'message' => 'تم إرسال بيانات الدفع بنجاح',
            'payment' => $payment,
            'booking' => $booking->load('design', 'payment'),
        ]);
    }
}

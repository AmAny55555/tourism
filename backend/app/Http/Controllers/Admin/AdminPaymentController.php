<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Models\Notification;
use Illuminate\Http\Request;

class AdminPaymentController extends Controller
{
    public function index()
    {
        $payments = Payment::with([
            'user:id,name,email',
            'booking.design',
        ])
            ->latest()
            ->get();

        return response()->json([
            'payments' => $payments,
        ]);
    }

    public function approve(Payment $payment)
    {
        $payment->update([
            'status' => 'approved',
        ]);

        $payment->booking->update([
            'status' => 'completed',
            'points_earned' => 30,
        ]);

        Notification::create([
            'user_id' => $payment->user_id,

            // القديم نسيبه عشان أي كود قديم مايقعش
            'title' => 'تم قبول الدفع ✅',
            'message' => 'تم قبول الدفع الخاص برحلتك بنجاح، وتمت إضافة 30 نقطة إلى حسابك.',

            // الجديد للترجمة
            'title_ar' => 'تم قبول الدفع ✅',
            'title_en' => 'Payment approved ✅',
            'message_ar' => 'تم قبول الدفع الخاص برحلتك بنجاح، وتمت إضافة 30 نقطة إلى حسابك.',
            'message_en' => 'Your trip payment has been approved successfully, and 30 points have been added to your account.',

            'type' => 'payment_approved',
            'url' => '/dashboard',
        ]);

        return response()->json([
            'message' => 'تم قبول الدفع وإضافة النقاط للعميل',
            'payment' => $payment->load(['user:id,name,email', 'booking.design']),
        ]);
    }

    public function reject(Request $request, Payment $payment)
    {
        $validated = $request->validate([
            'notes' => 'nullable|string|max:1000',
        ]);

        $payment->update([
            'status' => 'rejected',
            'notes' => $validated['notes'] ?? $payment->notes,
        ]);

        $payment->booking->update([
            'status' => 'designed',
        ]);

        Notification::create([
            'user_id' => $payment->user_id,

            // القديم نسيبه عشان أي كود قديم مايقعش
            'title' => 'تم رفض الدفع ❌',
            'message' => 'تم رفض الدفع الخاص برحلتك. يرجى مراجعة بيانات الدفع والمحاولة مرة أخرى.',

            // الجديد للترجمة
            'title_ar' => 'تم رفض الدفع ❌',
            'title_en' => 'Payment rejected ❌',
            'message_ar' => 'تم رفض الدفع الخاص برحلتك. يرجى مراجعة بيانات الدفع والمحاولة مرة أخرى.',
            'message_en' => 'Your trip payment was rejected. Please review your payment details and try again.',

            'type' => 'payment_rejected',
            'url' => '/dashboard',
        ]);

        return response()->json([
            'message' => 'تم رفض الدفع وإرجاع الرحلة لمرحلة التصميم',
            'payment' => $payment->load(['user:id,name,email', 'booking.design']),
        ]);
    }
}

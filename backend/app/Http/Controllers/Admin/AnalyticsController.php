<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Booking;
use App\Models\VisaApplication;
use App\Models\Payment;
use Illuminate\Support\Facades\DB;

class AnalyticsController extends Controller
{
    public function index()
    {
        // عدد المستخدمين
        $totalUsers = User::where('role', 'user')->count();

        // الرحلات
        $internalTrips = Booking::count();
        $foreignTrips = VisaApplication::count();

        // الحالات
        $underReviewTrips =
            Booking::where('status', 'under_review')->count()
            + VisaApplication::where('status', 'under_review')->count();

        $completedTrips =
            Booking::where('status', 'completed')->count()
            + VisaApplication::where('status', 'completed')->count();

        // عدد المدفوعات المقبولة (مفيش amount عندك)
        $acceptedPaymentsCount = Payment::where('status', 'approved')->count();

        // أكثر / أقل وجهة
    $mostTravelledDestination = Booking::select(
        'destination',
        'destination_ar',
        'destination_en',
        DB::raw('COUNT(*) as total')
    )
    ->groupBy('destination', 'destination_ar', 'destination_en')
    ->orderByDesc('total')
    ->first();

$leastTravelledDestination = Booking::select(
        'destination',
        'destination_ar',
        'destination_en',
        DB::raw('COUNT(*) as total')
    )
    ->groupBy('destination', 'destination_ar', 'destination_en')
    ->orderBy('total')
    ->first();

        // أكثر عميل سفرًا
        $topCustomer = Booking::select('user_id', DB::raw('COUNT(*) as total'))
            ->with('user:id,name,email')
            ->groupBy('user_id')
            ->orderByDesc('total')
            ->first();

        return response()->json([
            'cards' => [
                'total_users' => $totalUsers,
                'internal_trips' => $internalTrips,
                'foreign_trips' => $foreignTrips,
                'under_review_trips' => $underReviewTrips,
                'completed_trips' => $completedTrips,
                'accepted_payments_total' => $acceptedPaymentsCount, // 👈 عدد مش مبلغ
            ],

            'destinations' => [
                'most_travelled' => $mostTravelledDestination,
                'least_travelled' => $leastTravelledDestination,
            ],

            'top_customer' => $topCustomer,

            'requests_by_status' => [
                'under_review' => $underReviewTrips,
                'designed' => Booking::where('status', 'designed')->count(),
                'completed' => $completedTrips,
                'rejected' => Booking::where('status', 'rejected')->count(),
            ],

            'requests_by_type' => [
                'internal' => $internalTrips,
                'foreign' => $foreignTrips,
            ],
        ]);
    }
}

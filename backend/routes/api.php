<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\VisaApplicationController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\Admin\AdminBookingController;
use App\Http\Controllers\Admin\AdminPaymentController;
use App\Http\Controllers\Admin\AnalyticsController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\Admin\TravelCountryController;
use App\Http\Controllers\TravelController;
use App\Http\Controllers\DestinationController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Public travel routes
Route::get('/travel-countries', [TravelController::class, 'countries']);
Route::get('/travel-form/{country}', [TravelController::class, 'form']);

// 🔥 Public destinations
Route::get('/destinations', [DestinationController::class, 'index']);
Route::get('/destinations/{destination}', [DestinationController::class, 'show']);

Route::middleware('auth:sanctum')->group(function () {

    Route::get('/me', function (Request $request) {
        $user = $request->user();

        return response()->json([
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role ?? 'user',
            ],
        ]);
    });

    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/my-bookings', [BookingController::class, 'myBookings']);
    Route::post('/bookings', [BookingController::class, 'store']);

    Route::post('/visa/uae', [VisaApplicationController::class, 'storeUae']);
    Route::get('/my-visa-applications', [VisaApplicationController::class, 'myVisaApplications']);

    Route::get('/payments/{booking}', [PaymentController::class, 'show']);
    Route::post('/payments/{booking}', [PaymentController::class, 'store']);

    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::post('/notifications/{notification}/read', [NotificationController::class, 'markAsRead']);
    Route::post('/notifications/read-all', [NotificationController::class, 'markAllAsRead']);

    Route::post('/travel-submit', [TravelController::class, 'submit']);
    Route::get('/my-foreign-trip-requests', [TravelController::class, 'myRequests']);

    Route::get('/foreign-trip/{foreignRequest}', [TravelController::class, 'showForeignTrip']);
    Route::post('/foreign-payments/{foreignRequest}', [TravelController::class, 'storeForeignPayment']);

    // 🔥 ADMIN
    Route::prefix('admin')->middleware('admin')->group(function () {

        Route::get('/bookings', [AdminBookingController::class, 'index']);
        Route::post('/bookings/{booking}/design', [AdminBookingController::class, 'design']);

        Route::get('/payments', [AdminPaymentController::class, 'index']);
        Route::post('/payments/{payment}/approve', [AdminPaymentController::class, 'approve']);
        Route::post('/payments/{payment}/reject', [AdminPaymentController::class, 'reject']);

        Route::get('/analytics', [AnalyticsController::class, 'index']);

        Route::get('/travel-countries', [TravelCountryController::class, 'index']);
        Route::post('/travel-countries', [TravelCountryController::class, 'store']);
        Route::post('/travel-countries/{country}/fields', [TravelCountryController::class, 'addField']);
        Route::delete('/travel-form-fields/{field}', [TravelCountryController::class, 'deleteField']);

        Route::get('/foreign-trip-requests', [TravelController::class, 'adminRequests']);
        Route::post('/foreign-trip-requests/{foreignRequest}/design', [TravelController::class, 'designForeignRequest']);

        Route::get('/foreign-payments', [TravelController::class, 'adminForeignPayments']);
        Route::post('/foreign-payments/{payment}/approve', [TravelController::class, 'approveForeignPayment']);
        Route::post('/foreign-payments/{payment}/reject', [TravelController::class, 'rejectForeignPayment']);

        // 🔥 Destinations Admin
       Route::get('/destinations', [DestinationController::class, 'adminIndex']);
Route::post('/destinations', [DestinationController::class, 'store']);
Route::put('/destinations/{destination}', [DestinationController::class, 'update']);
Route::delete('/destinations/{destination}', [DestinationController::class, 'destroy']);;
    });
});

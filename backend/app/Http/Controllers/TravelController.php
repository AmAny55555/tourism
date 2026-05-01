<?php

namespace App\Http\Controllers;

use App\Models\TravelCountry;
use App\Models\ForeignTripRequest;
use App\Models\ForeignTripAnswer;
use App\Models\ForeignPayment;
use App\Models\Notification;
use App\Models\User;
use Illuminate\Http\Request;

class TravelController extends Controller
{
    public function countries()
    {
        $countries = TravelCountry::where('is_active', true)
         ->select('id', 'name', 'name_ar', 'name_en', 'slug', 'image')
            ->get();

        return response()->json([
            'countries' => $countries,
        ]);
    }

    public function form($countryId)
    {
        $country = TravelCountry::with(['fields' => function ($q) {
            $q->orderBy('sort_order');
        }])->findOrFail($countryId);

        return response()->json([
            'country' => $country,
        ]);
    }

    public function submit(Request $request)
    {
        $request->validate([
            'travel_country_id' => ['required', 'exists:travel_countries,id'],
            'answers' => ['required', 'array'],
        ]);

        $country = TravelCountry::with('fields')->findOrFail(
            $request->travel_country_id
        );

        foreach ($country->fields as $field) {
            if (!$field->is_required) {
                continue;
            }

            if ($field->type === 'file') {
                $request->validate([
                    "answers.{$field->name}" => ['required', 'file', 'max:10240'],
                ]);
            } else {
                $request->validate([
                    "answers.{$field->name}" => ['required'],
                ]);
            }
        }

        $tripRequest = ForeignTripRequest::create([
            'user_id' => auth()->id(),
            'travel_country_id' => $country->id,
            'status' => 'under_review',
        ]);

        $admins = User::where('role', 'admin')->get();

        foreach ($admins as $admin) {
            Notification::create([
                'user_id' => $admin->id,

                'title' => 'طلب رحلة خارجية جديد',
                'message' => 'تم إرسال طلب رحلة خارجية جديد، يرجى مراجعته.',

                'title_ar' => 'طلب رحلة خارجية جديد',
                'title_en' => 'New outbound trip request',
                'message_ar' => 'تم إرسال طلب رحلة خارجية جديد، يرجى مراجعته.',
                'message_en' => 'A new outbound trip request has been submitted. Please review it.',

                'type' => 'foreign_trip_request_created',
                'url' => '/admin',
            ]);
        }

        foreach ($country->fields as $field) {
            $value = null;

            if ($field->type === 'file') {
                if ($request->hasFile("answers.{$field->name}")) {
                    $value = $request
                        ->file("answers.{$field->name}")
                        ->store('foreign-trip-documents', 'public');
                }
            } else {
                $value = $request->input("answers.{$field->name}");
            }

            if ($value !== null && $value !== '') {
                ForeignTripAnswer::create([
                    'foreign_trip_request_id' => $tripRequest->id,
                    'travel_form_field_id' => $field->id,
                    'value' => $value,
                ]);
            }
        }

        return response()->json([
            'message' => 'تم إرسال طلب السفر بنجاح',
            'request' => $tripRequest,
        ], 201);
    }

    public function adminRequests()
    {
        $requests = ForeignTripRequest::with([
            'user:id,name,email',
         'country:id,name,name_ar,name_en',
            'answers.field:id,label,type',
        ])
            ->latest()
            ->get();

        return response()->json([
            'requests' => $requests,
        ]);
    }

    public function designForeignRequest(Request $request, ForeignTripRequest $foreignRequest)
    {
        $validated = $request->validate([
            'price' => ['required', 'numeric', 'min:1'],
            'admin_notes' => ['nullable', 'string'],
        ]);

        $foreignRequest->update([
            'price' => $validated['price'],
            'admin_notes' => $validated['admin_notes'] ?? null,
            'status' => 'designed',
        ]);

        Notification::create([
            'user_id' => $foreignRequest->user_id,

            'title' => 'تم تحديد سعر طلب السفر',
            'message' => 'تم تحديد تكلفة طلب السفر الخارجي. يمكنك الآن مراجعة التفاصيل والانتقال للدفع.',

            'title_ar' => 'تم تحديد سعر طلب السفر',
            'title_en' => 'Travel request price has been set',
            'message_ar' => 'تم تحديد تكلفة طلب السفر الخارجي. يمكنك الآن مراجعة التفاصيل والانتقال للدفع.',
            'message_en' => 'The cost of your outbound travel request has been set. You can now review the details and proceed to payment.',

            'type' => 'foreign_trip_designed',
            'url' => '/dashboard',
        ]);

        return response()->json([
            'message' => 'تم إرسال تكلفة وملاحظات الطلب بنجاح',
            'request' => $foreignRequest,
        ]);
    }

    public function myRequests()
    {
        $requests = ForeignTripRequest::with('country')
            ->where('user_id', auth()->id())
            ->latest()
            ->get();

        return response()->json([
            'requests' => $requests,
        ]);
    }

    public function showForeignTrip(ForeignTripRequest $foreignRequest)
    {
        if ($foreignRequest->user_id !== auth()->id()) {
            abort(403, 'غير مسموح لك بعرض هذا الطلب');
        }

     $foreignRequest->load('country:id,name,name_ar,name_en');

        return response()->json([
            'trip' => $foreignRequest,
        ]);
    }

    public function storeForeignPayment(Request $request, ForeignTripRequest $foreignRequest)
    {
        if ($foreignRequest->user_id !== auth()->id()) {
            abort(403, 'غير مسموح لك بالدفع لهذا الطلب');
        }

        if ($foreignRequest->status !== 'designed') {
            return response()->json([
                'message' => 'لا يمكن الدفع قبل تحديد السعر من الإدارة',
            ], 422);
        }

        $validated = $request->validate([
            'method' => ['required', 'in:vodafone_cash,instapay'],
            'transaction_reference' => ['required', 'string', 'max:255'],
            'notes' => ['nullable', 'string'],
        ]);

        $payment = ForeignPayment::create([
            'foreign_trip_request_id' => $foreignRequest->id,
            'method' => $validated['method'],
            'transaction_reference' => $validated['transaction_reference'],
            'notes' => $validated['notes'] ?? null,
            'amount' => $foreignRequest->price,
            'status' => 'pending',
        ]);

        $admins = User::where('role', 'admin')->get();

        foreach ($admins as $admin) {
            Notification::create([
                'user_id' => $admin->id,

                'title' => 'دفع جديد لرحلة خارجية',
                'message' => 'تم إرسال بيانات دفع جديدة لرحلة خارجية، يرجى مراجعتها.',

                'title_ar' => 'دفع جديد لرحلة خارجية',
                'title_en' => 'New outbound trip payment',
                'message_ar' => 'تم إرسال بيانات دفع جديدة لرحلة خارجية، يرجى مراجعتها.',
                'message_en' => 'New payment details for an outbound trip have been submitted. Please review them.',

                'type' => 'foreign_payment_submitted',
                'url' => '/admin/foreign-payments',
            ]);
        }

        $foreignRequest->update([
            'status' => 'confirmed',
        ]);

        return response()->json([
            'message' => 'تم إرسال بيانات الدفع بنجاح وسيتم مراجعتها من الإدارة',
            'request' => $foreignRequest,
            'payment' => $payment,
        ], 201);
    }

    public function adminForeignPayments()
    {
        $payments = ForeignPayment::with([
            'request.user:id,name,email',
          'request.country:id,name,name_ar,name_en',
        ])
            ->latest()
            ->get();

        return response()->json([
            'payments' => $payments,
        ]);
    }

    public function approveForeignPayment(ForeignPayment $payment)
    {
        if ($payment->status !== 'pending') {
            return response()->json([
                'message' => 'تم التعامل مع الدفع مسبقًا',
            ], 422);
        }

        $payment->update([
            'status' => 'approved',
        ]);

        $request = $payment->request;

        $request->update([
            'status' => 'completed',
        ]);

        $user = $request->user;
        $user->increment('points', 30);

        Notification::create([
            'user_id' => $user->id,

            'title' => 'تم قبول الدفع',
            'message' => 'تم قبول دفع طلب السفر الخارجي وإضافة 30 نقطة إلى حسابك.',

            'title_ar' => 'تم قبول الدفع',
            'title_en' => 'Payment approved',
            'message_ar' => 'تم قبول دفع طلب السفر الخارجي وإضافة 30 نقطة إلى حسابك.',
            'message_en' => 'Your outbound travel payment has been approved, and 30 points have been added to your account.',

            'type' => 'foreign_payment_approved',
            'url' => '/dashboard',
        ]);

        return response()->json([
            'message' => 'تم قبول الدفع وإكمال الرحلة',
        ]);
    }

    public function rejectForeignPayment(Request $req, ForeignPayment $payment)
    {
        if ($payment->status !== 'pending') {
            return response()->json([
                'message' => 'تم التعامل مع الدفع مسبقًا',
            ], 422);
        }

        $payment->update([
            'status' => 'rejected',
            'notes' => $req->notes,
        ]);

        Notification::create([
            'user_id' => $payment->request->user_id,

            'title' => 'تم رفض الدفع',
            'message' => 'تم رفض دفع طلب السفر الخارجي. يرجى مراجعة الملاحظات والمحاولة مرة أخرى.',

            'title_ar' => 'تم رفض الدفع',
            'title_en' => 'Payment rejected',
            'message_ar' => 'تم رفض دفع طلب السفر الخارجي. يرجى مراجعة الملاحظات والمحاولة مرة أخرى.',
            'message_en' => 'Your outbound travel payment was rejected. Please review the notes and try again.',

            'type' => 'foreign_payment_rejected',
            'url' => '/dashboard',
        ]);

        return response()->json([
            'message' => 'تم رفض الدفع',
        ]);
    }
}

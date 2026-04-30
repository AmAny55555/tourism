<?php

namespace App\Http\Controllers;

use App\Models\VisaApplication;
use Illuminate\Http\Request;

class VisaApplicationController extends Controller
{
    public function storeUae(Request $request)
    {
        $validated = $request->validate([
            'nationality' => 'required|string|max:255',
            'emirate' => 'required|string|max:255',
            'travel_date' => 'required|date',
            'from_country' => 'required|string|max:255',
            'passport_number' => 'required|string|max:255',
            'job' => 'required|string|max:255',
            'passport_expiry' => 'required|date',

            'full_name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:255',

            'face_photo' => 'required|file|mimes:jpg,jpeg,png,pdf|max:5120',
            'passport_copy' => 'required|file|mimes:jpg,jpeg,png,pdf|max:5120',
            'passport_cover' => 'required|file|mimes:jpg,jpeg,png,pdf|max:5120',
            'national_id' => 'required|file|mimes:jpg,jpeg,png,pdf|max:5120',
            'bank_statement' => 'required|file|mimes:jpg,jpeg,png,pdf|max:5120',
            'police_certificate' => 'required|file|mimes:jpg,jpeg,png,pdf|max:5120',
            'extra_document' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:5120',
        ]);

        $data = [
            'user_id' => $request->user()->id,
            'country' => 'الإمارات',
            'nationality' => $validated['nationality'],
            'emirate' => $validated['emirate'],
            'travel_date' => $validated['travel_date'],
            'from_country' => $validated['from_country'],
            'passport_number' => $validated['passport_number'],
            'job' => $validated['job'],
            'passport_expiry' => $validated['passport_expiry'],
            'full_name' => $validated['full_name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'],
            'status' => 'under_review',
        ];

        $fileFields = [
            'face_photo',
            'passport_copy',
            'passport_cover',
            'national_id',
            'bank_statement',
            'police_certificate',
            'extra_document',
        ];

        foreach ($fileFields as $field) {
            if ($request->hasFile($field)) {
                $data[$field] = $request->file($field)->store('visa-applications/uae', 'public');
            }
        }

        $application = VisaApplication::create($data);

        return response()->json([
            'message' => 'تم إرسال طلب الإمارات بنجاح',
            'application' => $application,
        ], 201);
    }

    public function myVisaApplications(Request $request)
    {
        $applications = VisaApplication::where('user_id', $request->user()->id)
            ->latest()
            ->get();

        return response()->json([
            'applications' => $applications,
        ]);
    }
}

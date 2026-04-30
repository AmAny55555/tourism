<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\TravelCountry;
use App\Models\TravelFormField;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class TravelCountryController extends Controller
{
    public function index()
    {
        $countries = TravelCountry::with(['fields' => function ($query) {
            $query->orderBy('sort_order');
        }])
            ->latest()
            ->get();

        return response()->json([
            'countries' => $countries,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'image' => ['nullable', 'string', 'max:1000'],
            'is_active' => ['nullable', 'boolean'],
        ]);

        $country = TravelCountry::create([
            'name' => $validated['name'],
            'slug' => Str::slug($validated['name']),
            'image' => $validated['image'] ?? null,
            'is_active' => $validated['is_active'] ?? true,
        ]);

        return response()->json([
            'message' => 'تم إضافة الدولة بنجاح',
            'country' => $country,
        ], 201);
    }

    public function addField(Request $request, TravelCountry $country)
    {
        $validated = $request->validate([
            'label' => ['required', 'string', 'max:255'],

            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('travel_form_fields', 'name')
                    ->where('travel_country_id', $country->id),
            ],

            'type' => ['required', 'in:text,email,phone,date,select,file,textarea'],
            'options' => ['nullable', 'array'],
            'is_required' => ['nullable', 'boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ], [
            'name.unique' => 'الحقل ده موجود بالفعل في نفس الدولة',
        ]);

        $field = TravelFormField::create([
            'travel_country_id' => $country->id,
            'label' => $validated['label'],
            'name' => $validated['name'],
            'type' => $validated['type'],
            'options' => $validated['options'] ?? null,
            'is_required' => $validated['is_required'] ?? false,
            'sort_order' => $validated['sort_order'] ?? 0,
        ]);

        return response()->json([
            'message' => 'تم إضافة الحقل بنجاح',
            'field' => $field,
        ], 201);
    }

    public function deleteField(TravelFormField $field)
    {
        $field->delete();

        return response()->json([
            'message' => 'تم حذف الحقل بنجاح',
        ]);
    }
}

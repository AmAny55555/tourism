<?php

namespace App\Http\Controllers;

use App\Models\Destination;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class DestinationController extends Controller
{
    private function formatDestination(Destination $d, string $lang): array
    {
        return [
            'id' => $d->id,
            'slug' => $d->slug,

            'name' => $lang === 'en' ? ($d->name_en ?? $d->name) : ($d->name_ar ?? $d->name),
            'location' => $lang === 'en' ? ($d->location_en ?? $d->location) : ($d->location_ar ?? $d->location),
            'category' => $d->category,

            'price' => $d->price,
            'rating' => $d->rating,
            'days' => $d->days,

            'badge' => $lang === 'en' ? ($d->badge_en ?? $d->badge) : ($d->badge_ar ?? $d->badge),
            'description' => $lang === 'en' ? ($d->description_en ?? $d->description) : ($d->description_ar ?? $d->description),
            'overview' => $d->overview,

            'landmarks' => $lang === 'en'
                ? ($d->landmarks_en ?? $d->landmarks)
                : ($d->landmarks_ar ?? $d->landmarks),

            'best_time_to_visit' => $lang === 'en'
                ? ($d->best_time_to_visit_en ?? $d->best_time_to_visit)
                : ($d->best_time_to_visit_ar ?? $d->best_time_to_visit),

            'image' => $d->image,
            'cover_image' => $d->cover_image,
            'is_active' => $d->is_active,
            'is_featured' => $d->is_featured,
            'created_at' => $d->created_at,
            'updated_at' => $d->updated_at,
        ];
    }

    public function index(Request $request)
    {
        $lang = $request->query('lang', 'ar');

        $destinations = Destination::where('is_active', true)
            ->latest()
            ->get()
            ->map(fn ($destination) => $this->formatDestination($destination, $lang));

        return response()->json([
            'destinations' => $destinations,
        ]);
    }

    public function adminIndex()
    {
        $destinations = Destination::latest()->get();

        return response()->json([
            'destinations' => $destinations,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'name_ar' => ['nullable', 'string', 'max:255'],
            'name_en' => ['nullable', 'string', 'max:255'],

            'location' => ['nullable', 'string', 'max:255'],
            'location_ar' => ['nullable', 'string', 'max:255'],
            'location_en' => ['nullable', 'string', 'max:255'],

            'category' => ['nullable', 'string', 'max:255'],
            'price' => ['required', 'numeric', 'min:0'],
            'rating' => ['nullable', 'numeric', 'min:0', 'max:5'],
            'days' => ['nullable', 'integer', 'min:1'],

            'badge' => ['nullable', 'string', 'max:255'],
            'badge_ar' => ['nullable', 'string', 'max:255'],
            'badge_en' => ['nullable', 'string', 'max:255'],

            'description' => ['nullable', 'string'],
            'description_ar' => ['nullable', 'string'],
            'description_en' => ['nullable', 'string'],

            'overview' => ['nullable', 'string'],

            'landmarks' => ['nullable', 'array'],
            'landmarks_ar' => ['nullable', 'string'],
            'landmarks_en' => ['nullable', 'string'],

            'best_time_to_visit' => ['nullable', 'string', 'max:255'],
            'best_time_to_visit_ar' => ['nullable', 'string', 'max:255'],
            'best_time_to_visit_en' => ['nullable', 'string', 'max:255'],

            'image' => ['nullable', 'image', 'max:4096'],
            'cover_image' => ['nullable', 'image', 'max:4096'],

            'is_active' => ['nullable', 'boolean'],
            'is_featured' => ['nullable', 'boolean'],
        ]);

        $imagePath = null;
        $coverPath = null;

        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('destinations', 'public');
        }

        if ($request->hasFile('cover_image')) {
            $coverPath = $request->file('cover_image')->store('destinations', 'public');
        }

        $destination = Destination::create([
            'name' => $validated['name'],
            'name_ar' => $validated['name_ar'] ?? $validated['name'],
            'name_en' => $validated['name_en'] ?? $validated['name'],

            'slug' => Str::slug($validated['name']) . '-' . time(),

            'location' => $validated['location'] ?? null,
            'location_ar' => $validated['location_ar'] ?? ($validated['location'] ?? null),
            'location_en' => $validated['location_en'] ?? ($validated['location'] ?? null),

            'category' => $validated['category'] ?? 'Economy Class',

            'price' => $validated['price'],
            'rating' => $validated['rating'] ?? 4.5,
            'days' => $validated['days'] ?? 1,

            'badge' => $validated['badge'] ?? null,
            'badge_ar' => $validated['badge_ar'] ?? ($validated['badge'] ?? null),
            'badge_en' => $validated['badge_en'] ?? ($validated['badge'] ?? null),

            'description' => $validated['description'] ?? null,
            'description_ar' => $validated['description_ar'] ?? ($validated['description'] ?? null),
            'description_en' => $validated['description_en'] ?? ($validated['description'] ?? null),

            'overview' => $validated['overview'] ?? null,

            'landmarks' => $validated['landmarks'] ?? [],
            'landmarks_ar' => $validated['landmarks_ar'] ?? null,
            'landmarks_en' => $validated['landmarks_en'] ?? null,

            'best_time_to_visit' => $validated['best_time_to_visit'] ?? null,
            'best_time_to_visit_ar' => $validated['best_time_to_visit_ar'] ?? ($validated['best_time_to_visit'] ?? null),
            'best_time_to_visit_en' => $validated['best_time_to_visit_en'] ?? ($validated['best_time_to_visit'] ?? null),

            'image' => $imagePath,
            'cover_image' => $coverPath,

            'is_featured' => $validated['is_featured'] ?? false,
            'is_active' => $validated['is_active'] ?? true,
        ]);

        return response()->json([
            'message' => 'تم إضافة الوجهة بنجاح',
            'destination' => $destination,
        ], 201);
    }

    public function show(Request $request, $slug)
    {
        $lang = $request->query('lang', 'ar');

        $destination = Destination::where('slug', $slug)
            ->where('is_active', true)
            ->firstOrFail();

        return response()->json([
            'destination' => $this->formatDestination($destination, $lang),
        ]);
    }

    public function update(Request $request, Destination $destination)
    {
        $validated = $request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'name_ar' => ['nullable', 'string', 'max:255'],
            'name_en' => ['nullable', 'string', 'max:255'],

            'location' => ['nullable', 'string', 'max:255'],
            'location_ar' => ['nullable', 'string', 'max:255'],
            'location_en' => ['nullable', 'string', 'max:255'],

            'category' => ['nullable', 'string', 'max:255'],
            'price' => ['sometimes', 'required', 'numeric', 'min:0'],
            'rating' => ['nullable', 'numeric', 'min:0', 'max:5'],
            'days' => ['nullable', 'integer', 'min:1'],

            'badge' => ['nullable', 'string', 'max:255'],
            'badge_ar' => ['nullable', 'string', 'max:255'],
            'badge_en' => ['nullable', 'string', 'max:255'],

            'description' => ['nullable', 'string'],
            'description_ar' => ['nullable', 'string'],
            'description_en' => ['nullable', 'string'],

            'overview' => ['nullable', 'string'],

            'landmarks' => ['nullable', 'array'],
            'landmarks_ar' => ['nullable', 'string'],
            'landmarks_en' => ['nullable', 'string'],

            'best_time_to_visit' => ['nullable', 'string', 'max:255'],
            'best_time_to_visit_ar' => ['nullable', 'string', 'max:255'],
            'best_time_to_visit_en' => ['nullable', 'string', 'max:255'],

            'image' => ['nullable', 'image', 'max:4096'],
            'cover_image' => ['nullable', 'image', 'max:4096'],

            'is_active' => ['nullable', 'boolean'],
            'is_featured' => ['nullable', 'boolean'],
        ]);

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('destinations', 'public');
        }

        if ($request->hasFile('cover_image')) {
            $validated['cover_image'] = $request->file('cover_image')->store('destinations', 'public');
        }

        if (isset($validated['name'])) {
            $validated['slug'] = Str::slug($validated['name']) . '-' . time();

            $validated['name_ar'] = $validated['name_ar'] ?? $validated['name'];
            $validated['name_en'] = $validated['name_en'] ?? $validated['name'];
        }

        if (array_key_exists('location', $validated)) {
            $validated['location_ar'] = $validated['location_ar'] ?? $validated['location'];
            $validated['location_en'] = $validated['location_en'] ?? $validated['location'];
        }

        if (array_key_exists('badge', $validated)) {
            $validated['badge_ar'] = $validated['badge_ar'] ?? $validated['badge'];
            $validated['badge_en'] = $validated['badge_en'] ?? $validated['badge'];
        }

        if (array_key_exists('description', $validated)) {
            $validated['description_ar'] = $validated['description_ar'] ?? $validated['description'];
            $validated['description_en'] = $validated['description_en'] ?? $validated['description'];
        }

        if (array_key_exists('best_time_to_visit', $validated)) {
            $validated['best_time_to_visit_ar'] = $validated['best_time_to_visit_ar'] ?? $validated['best_time_to_visit'];
            $validated['best_time_to_visit_en'] = $validated['best_time_to_visit_en'] ?? $validated['best_time_to_visit'];
        }

        $destination->update($validated);

        return response()->json([
            'message' => 'تم تعديل الوجهة بنجاح',
            'destination' => $destination,
        ]);
    }

    public function destroy(Destination $destination)
    {
        $destination->delete();

        return response()->json([
            'message' => 'تم حذف الوجهة بنجاح',
        ]);
    }
}

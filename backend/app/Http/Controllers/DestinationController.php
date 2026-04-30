<?php

namespace App\Http\Controllers;

use App\Models\Destination;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class DestinationController extends Controller
{
    public function index()
    {
        $destinations = Destination::where('is_active', true)
            ->latest()
            ->get();

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
            'location' => ['nullable', 'string', 'max:255'],
            'category' => ['nullable', 'string', 'max:255'],
            'price' => ['required', 'numeric', 'min:0'],
            'rating' => ['nullable', 'numeric', 'min:0', 'max:5'],
            'days' => ['nullable', 'integer', 'min:1'],
            'badge' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'image' => ['nullable', 'image', 'max:4096'],
            'is_active' => ['nullable', 'boolean'],
        ]);

        $imagePath = null;

        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('destinations', 'public');
        }

        $destination = Destination::create([
            'name' => $validated['name'],
            'slug' => Str::slug($validated['name']) . '-' . time(),
            'location' => $validated['location'] ?? null,
            'category' => $validated['category'] ?? 'Economy Class',
            'price' => $validated['price'],
            'rating' => $validated['rating'] ?? 4.5,
            'days' => $validated['days'] ?? 1,
            'badge' => $validated['badge'] ?? null,
            'description' => $validated['description'] ?? null,
            'image' => $imagePath,
            'is_active' => $validated['is_active'] ?? true,
        ]);

        return response()->json([
            'message' => 'تم إضافة الوجهة بنجاح',
            'destination' => $destination,
        ], 201);
    }

 public function show($slug)
{
    $destination = Destination::where('slug', $slug)
        ->where('is_active', true)
        ->firstOrFail();

    return response()->json([
        'destination' => $destination,
    ]);
}

    public function update(Request $request, Destination $destination)
    {
        $validated = $request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'location' => ['nullable', 'string', 'max:255'],
            'category' => ['nullable', 'string', 'max:255'],
            'price' => ['sometimes', 'required', 'numeric', 'min:0'],
            'rating' => ['nullable', 'numeric', 'min:0', 'max:5'],
            'days' => ['nullable', 'integer', 'min:1'],
            'badge' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'image' => ['nullable', 'image', 'max:4096'],
            'is_active' => ['nullable', 'boolean'],
        ]);

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('destinations', 'public');
        }

        if (isset($validated['name'])) {
            $validated['slug'] = Str::slug($validated['name']) . '-' . time();
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

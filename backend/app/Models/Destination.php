<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Destination extends Model
{
    protected $fillable = [
        'name',
        'name_ar',
        'name_en',
        'slug',
        'location',
        'location_ar',
'location_en',
        'category',
        'price',
        'rating',
        'days',
        'badge',
        'badge_ar',
        'badge_en',
        'description',
        'description_ar',
        'description_en',
        'overview',
        'landmarks',
        'landmarks_ar',
        'landmarks_en',
        'best_time_to_visit',
        'best_time_to_visit_ar',
        'best_time_to_visit_en',
        'image',
        'cover_image',
        'is_featured',
        'is_active',
    ];

    protected $casts = [
        'landmarks' => 'array',
        'is_featured' => 'boolean',
        'is_active' => 'boolean',
        'price' => 'decimal:2',
        'rating' => 'decimal:1',
    ];
}
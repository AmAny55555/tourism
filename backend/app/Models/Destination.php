<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Destination extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'location',
        'category',
        'price',
        'rating',
        'days',
        'badge',
        'description',
        'image',
        'is_active',
    ];
}

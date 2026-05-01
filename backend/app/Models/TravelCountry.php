<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TravelCountry extends Model
{
    protected $fillable = [
        'name',
        'name_ar',
        'name_en',
        'slug',
        'image',
        'is_active',
    ];

    public function fields()
    {
        return $this->hasMany(TravelFormField::class);
    }

    public function requests()
    {
        return $this->hasMany(ForeignTripRequest::class);
    }
}
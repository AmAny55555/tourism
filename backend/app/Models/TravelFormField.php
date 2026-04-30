<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TravelFormField extends Model
{
    protected $fillable = [
        'travel_country_id',
        'label',
        'name',
        'type',
        'options',
        'is_required',
        'sort_order',
    ];

    protected $casts = [
        'options' => 'array',
        'is_required' => 'boolean',
    ];

    public function country()
    {
        return $this->belongsTo(TravelCountry::class, 'travel_country_id');
    }
}

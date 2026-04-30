<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ForeignTripRequest extends Model
{
    protected $fillable = [
        'user_id',
        'travel_country_id',
        'status',
        'admin_notes',
        'price',
    ];

    public function country()
    {
        return $this->belongsTo(TravelCountry::class, 'travel_country_id');
    }

    public function answers()
    {
        return $this->hasMany(ForeignTripAnswer::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function payments()
{
    return $this->hasMany(ForeignPayment::class);
}
}

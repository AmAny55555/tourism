<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    protected $fillable = [
        'user_id',
        'destination',
        'days_count',
        'travel_date',
        'adults_count',
        'children_count',
        'trip_class',
        'notes',
        'status',
        'points_earned',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function design()
    {
        return $this->hasOne(TripDesign::class);
    }

    public function payment()
{
    return $this->hasOne(Payment::class);
}
}

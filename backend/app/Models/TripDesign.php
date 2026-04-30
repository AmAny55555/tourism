<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TripDesign extends Model
{
    protected $fillable = [
        'booking_id',
        'hotel_name',
        'transport_type',
        'total_price',
        'details',
    ];

    public function booking()
    {
        return $this->belongsTo(Booking::class);
    }
}

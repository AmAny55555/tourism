<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ForeignPayment extends Model
{
    protected $fillable = [
        'foreign_trip_request_id',
        'method',
        'transaction_reference',
        'notes',
        'amount',
        'status',
    ];

    public function request()
    {
        return $this->belongsTo(ForeignTripRequest::class, 'foreign_trip_request_id');
    }
}

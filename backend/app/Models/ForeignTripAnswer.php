<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ForeignTripAnswer extends Model
{
  protected $fillable = [
    'foreign_trip_request_id',
    'travel_form_field_id',
    'value',
    'value_ar',
    'value_en',
];
    public function request()
    {
        return $this->belongsTo(ForeignTripRequest::class, 'foreign_trip_request_id');
    }

    public function field()
    {
        return $this->belongsTo(TravelFormField::class, 'travel_form_field_id');
    }
}

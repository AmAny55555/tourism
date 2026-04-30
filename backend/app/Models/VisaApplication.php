<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VisaApplication extends Model
{
    protected $fillable = [
        'user_id', // 👈 دي كانت ناقصة
        'country',
        'nationality',
        'emirate',
        'travel_date',
        'from_country',
        'passport_number',
        'job',
        'passport_expiry',
        'full_name',
        'email',
        'phone',
        'face_photo',
        'passport_copy',
        'passport_cover',
        'national_id',
        'bank_statement',
        'police_certificate',
        'extra_document',
        'status',
        'price',
        'admin_notes',
    ];
}

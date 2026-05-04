<?php

namespace App\Http\Controllers;

use App\Models\ContactMessage;
use Illuminate\Http\Request;

class ContactMessageController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'full_name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'destination' => ['nullable', 'string', 'max:255'],
            'trip_details' => ['required', 'string'],
        ]);

        ContactMessage::create($data);

        return response()->json([
            'message' => 'Message sent successfully',
        ], 201);
    }
}

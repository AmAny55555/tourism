<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Symfony\Component\HttpFoundation\Cookie;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:6'
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        $cookie = cookie(
            'auth_token',
            $token,
            60 * 24 * 7, // 7 days
            null,
            null,
            false, // true في production مع https
            true,  // httpOnly
            false,
            'Lax'
        );

        return response()->json([
            'user' => $user,
            'message' => 'Registered successfully'
        ])->withCookie($cookie);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'بيانات الدخول غير صحيحة'], 401);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        $cookie = cookie(
            'auth_token',
            $token,
            60 * 24 * 7,
            null,
            null,
            false,
            true,
            false,
            'Lax'
        );

        return response()->json([
            'user' => $user,
            'message' => 'Logged in successfully'
        ])->withCookie($cookie);
    }

    public function logout(Request $request)
    {
        $request->user()?->currentAccessToken()?->delete();

        return response()->json([
            'message' => 'Logged out successfully'
        ])->withoutCookie('auth_token');
    }
}

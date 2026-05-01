<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Laravel\Socialite\Facades\Socialite;

class AuthController extends Controller
{
    private function createAuthCookie($token)
    {
        return cookie(
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
    }

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

        return response()->json([
            'user' => $user,
            'message' => 'Registered successfully'
        ])->withCookie($this->createAuthCookie($token));
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

        return response()->json([
            'user' => $user,
            'message' => 'Logged in successfully'
        ])->withCookie($this->createAuthCookie($token));
    }

    public function redirectToGoogle()
    {
        return Socialite::driver('google')
            ->stateless()
            ->redirect();
    }

    public function handleGoogleCallback()
    {
        try {
            $googleUser = Socialite::driver('google')
                ->stateless()
                ->user();

            $user = User::updateOrCreate(
                ['email' => $googleUser->getEmail()],
                [
                    'name' => $googleUser->getName(),
                    'google_id' => $googleUser->getId(),
                    'password' => Hash::make(str()->random(32)),
                ]
            );

            $token = $user->createToken('auth_token')->plainTextToken;

            return redirect(env('FRONTEND_URL', 'http://localhost:3000'))
                ->withCookie($this->createAuthCookie($token));

        } catch (\Exception $e) {
            return redirect(
                env('FRONTEND_URL', 'http://localhost:3000') .
                '/auth/login?error=google_login_failed'
            );
        }
    }

    public function logout(Request $request)
    {
        $request->user()?->currentAccessToken()?->delete();

        return response()->json([
            'message' => 'Logged out successfully'
        ])->withoutCookie('auth_token');
    }
}

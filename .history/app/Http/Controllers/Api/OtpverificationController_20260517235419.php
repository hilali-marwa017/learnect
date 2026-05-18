<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\OtpVerification;
use Illuminate\Http\Request;
use Carbon\Carbon;

class AuthController extends Controller
{
    // INSCRIPTION + OTP
    public function register(Request $request)
    {
        $request->validate([
            'name'       => 'required|string',
            'telephone'  => 'required|string|unique:users,telephone',
            'password'   => 'required|string|min:6',
        ]);

        // 1. Create user مباشرة
        $user = User::create([
            'name'       => $request->name,
            'telephone'  => $request->telephone,
            'password'   => Hash::make($request->password),
            'role'       => 'enseignant',
            'statut'     => 'en_attente',
        ]);

        // 2. OTP
        $code = rand(100000, 999999);

        OtpVerification::create([
            'telephone'      => $user->telephone,
            'code'           => $code,
            'expire_at'      => Carbon::now()->addMinutes(10),
            'est_utilise'    => false,
            'type'           => 'inscription',
            'id_utilisateur' => $user->id,
        ]);

        return response()->json([
            'message' => 'User created, OTP sent',
            'otp_dev' => $code
        ]);
    }

    // VERIFY OTP
    public function verifyOtp(Request $request)
    {
        $request->validate([
            'telephone' => 'required',
            'code'      => 'required',
        ]);

        $otp = OtpVerification::where('telephone', $request->telephone)
            ->where('code', $request->code)
            ->where('est_utilise', false)
            ->where('expire_at', '>', Carbon::now())
            ->first();

        if (!$otp) {
            return response()->json([
                'message' => 'OTP invalid'
            ], 400);
        }

        $otp->update(['est_utilise' => true]);

        $user = User::find($otp->id_utilisateur);

        $user->update([
            'statut' => 'actif'
        ]);

        return response()->json([
            'message' => 'Account verified',
            'user' => $user
        ]);
    }
}
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\OtpVerification;
use App\Models\User;
use Illuminate\Http\Request;
use Carbon\Carbon;

class OtpVerificationController extends Controller
{
    // =====================
    // 1. SEND OTP (ANY NUMBER)
    // =====================
    public function envoyer(Request $request)
    {
        $request->validate([
            'telephone' => 'required|string',
            'type'      => 'required|in:inscription,connexion',
        ]);

        // توليد code
        $code = rand(100000, 999999);

        // حذف OTP قديم لنفس الرقم
        OtpVerification::where('telephone', $request->telephone)
            ->where('type', $request->type)
            ->delete();

        // إنشاء OTP بدون user dependency
        $otp = OtpVerification::create([
            'telephone'      => $request->telephone,
            'code'           => $code,
            'expire_at'      => Carbon::now()->addMinutes(10),
            'est_utilise'    => false,
            'type'           => $request->type,
            'id_utilisateur' => $request->id_utilisateur,
        ]);

        return response()->json([
            'message'   => 'OTP envoyé avec succès',
            'otp_dev'   => $code,
            'expire_at' => $otp->expire_at,
        ]);
    }

    // =====================
    // 2. VERIFY OTP
    // =====================
    public function verifier(Request $request)
    {
        $request->validate([
            'telephone' => 'required|string',
            'code'      => 'required|string',
            'type'      => 'required|in:inscription,connexion',
        ]);

        $otp = OtpVerification::where('telephone', $request->telephone)
            ->where('code', $request->code)
            ->where('type', $request->type)
            ->where('est_utilise', false)
            ->where('expire_at', '>', Carbon::now())
            ->first();

        if (!$otp) {
            return response()->json([
                'message' => 'Code invalide ou expiré'
            ], 400);
        }

        $otp->update(['est_utilise' => true]);

        // =========================
        // INSCRIPTION FLOW
        // =========================
        if ($request->type === 'inscription') {

            $user = User::firstOrCreate(
                ['telephone' => $request->telephone],
                [
                    'statut' => 'actif'
                ]
            );

        } 
        // =========================
        // CONNEXION FLOW
        // =========================
        else {

            $user = User::where('telephone', $request->telephone)->first();

            if (!$user) {
                return response()->json([
                    'message' => 'Utilisateur n’existe pas'
                ], 404);
            }
        }

        // Token
        $token = $user->createToken('api-token')->plainTextToken;

        return response()->json([
            'message' => 'OTP vérifié avec succès',
            'user'    => $user,
            'token'   => $token,
        ]);
    }

    // =====================
    // 3. RESEND OTP
    // =====================
    public function renvoyer(Request $request)
    {
        $request->validate([
            'telephone' => 'required|string',
            'type'      => 'required|in:inscription,connexion',
        ]);

        $lastOtp = OtpVerification::where('telephone', $request->telephone)
            ->where('type', $request->type)
            ->orderBy('created_at', 'desc')
            ->first();

        if ($lastOtp && $lastOtp->created_at > Carbon::now()->subMinute()) {
            return response()->json([
                'message' => 'Attendez 1 minute'
            ], 429);
        }

        $code = rand(100000, 999999);

        OtpVerification::create([
            'telephone'      => $request->telephone,
            'code'           => $code,
            'expire_at'      => Carbon::now()->addMinutes(10),
            'est_utilise'    => false,
            'type'           => $request->type,
            'id_utilisateur' => null,
        ]);

        return response()->json([
            'message' => 'Nouveau code envoyé',
            'otp_dev' => $code,
        ]);
    }
}
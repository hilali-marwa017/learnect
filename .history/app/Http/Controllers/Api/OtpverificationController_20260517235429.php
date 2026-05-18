<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\OtpVerification;
use App\Models\User;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;

class OtpVerificationController extends Controller
{
    // ======================
    // 1. Envoyer OTP
    // ======================
    public function envoyer(Request $request)
    {
        $request->validate([
            'telephone' => 'required|string',
            'type'      => 'required|in:inscription,connexion',
        ]);

        // البحث عن user (اختياري حسب flow ديالك)
        $user = User::where('telephone', $request->telephone)->first();

        // توليد OTP
        $code = rand(100000, 999999);

        // حذف OTP قديم
        OtpVerification::where('telephone', $request->telephone)
            ->where('type', $request->type)
            ->delete();

        // تخزين OTP
        $otp = OtpVerification::create([
            'telephone'      => $request->telephone,
            'code'           => $code,
            'expire_at'      => Carbon::now()->addMinutes(10),
            'est_utilise'    => false,
            'type'           => $request->type,
            'id_utilisateur' => $user ? $user->utilisateur_id : null,
        ]);

        return response()->json([
            'message'   => 'OTP généré avec succès',
            'otp_dev'   => $code,
            'expire_at' => $otp->expire_at,
        ]);
    }

    // ======================
    // 2. Vérifier OTP
    // ======================
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
                'message' => 'Code OTP invalide ou expiré'
            ], 400);
        }

        $otp->update([
            'est_utilise' => true
        ]);

        $user = User::where('telephone', $request->telephone)->first();

        if ($user) {
            $user->update([
                'statut' => 'actif'
            ]);

            $token = $user->createToken('api-token')->plainTextToken;

            return response()->json([
                'message' => 'OTP vérifié avec succès',
                'user'    => $user,
                'token'   => $token,
            ]);
        }

        return response()->json([
            'message' => 'OTP vérifié mais user non trouvé'
        ]);
    }

    // ======================
    // 3. Renvoyer OTP
    // ======================
    public function renvoyer(Request $request)
    {
        $request->validate([
            'telephone' => 'required|string',
            'type'      => 'required|in:inscription,connexion',
        ]);

        // anti spam 1 min
        $lastOtp = OtpVerification::where('telephone', $request->telephone)
            ->where('type', $request->type)
            ->orderBy('created_at', 'desc')
            ->first();

        if ($lastOtp && $lastOtp->created_at > Carbon::now()->subMinute()) {
            return response()->json([
                'message' => 'Attendez 1 minute avant de renvoyer'
            ], 429);
        }

        // حذف القديم
        OtpVerification::where('telephone', $request->telephone)
            ->where('type', $request->type)
            ->delete();

        // جديد
        $code = rand(100000, 999999);

        $otp = OtpVerification::create([
            'telephone'      => $request->telephone,
            'code'           => $code,
            'expire_at'      => Carbon::now()->addMinutes(10),
            'est_utilise'    => false,
            'type'           => $request->type,
            'id_utilisateur' => null,
        ]);

        return response()->json([
            'message'   => 'Nouveau OTP généré',
            'otp_dev'   => $code,
            'expire_at' => $otp->expire_at,
        ]);
    }
}
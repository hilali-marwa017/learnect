<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\OtpVerification;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class OtpVerificationController extends Controller
{
    // =========================
    // 1. ENVOYER OTP
    // =========================
    public function envoyer(Request $request)
    {
        $request->validate([
            'telephone' => 'required|string|in:users,telephone',
            'type'      => 'required|in:connexion,inscription',
        ]);

        $user = User::where('telephone', $request->telephone)->first();

        if (!$user) {
            return response()->json([
                'message' => 'Utilisateur introuvable !'
            ], 404);
        }

        // delete old OTP
        OtpVerification::where('telephone', $request->telephone)
            ->where('type', 'connexion')
            ->delete();

        // generate code
        $code = rand(100000, 999999);

        // save OTP
        OtpVerification::create([
            'telephone'      => $request->telephone,
            'code'           => $code,
            'expire_at'      => Carbon::now()->addMinutes(10),
            'est_utilise'    => false,
            'type'           => 'connexion',
            'id_utilisateur' => $user->utilisateur_id,
        ]);

        return response()->json([
            'message'   => 'Code OTP envoyé !',
            'otp_dev'   => $code,
            'expire_at' => Carbon::now()->addMinutes(10),
        ]);
    }

    // =========================
    // 2. VERIFIER OTP
    // =========================
    public function verifier(Request $request)
    {
        $request->validate([
            'telephone' => 'required|string',
            'code'      => 'required|string',
        ]);

        $otp = OtpVerification::where('telephone', $request->telephone)
            ->where('code', $request->code)
            ->where('type', 'connexion')
            ->where('est_utilise', false)
            ->where('expire_at', '>', Carbon::now())
            ->first();

        if (!$otp) {
            return response()->json([
                'message' => 'Code OTP invalide ou expiré !'
            ], 400);
        }

        $otp->update([
            'est_utilise' => true
        ]);

        $user = User::find($otp->id_utilisateur);

        if (!$user) {
            return response()->json([
                'message' => 'Utilisateur introuvable !'
            ], 404);
        }

        $token = $user->createToken('otp-token')->plainTextToken;

        return response()->json([
            'message' => 'Connexion réussie !',
            'user'    => $user,
            'token'   => $token,
        ]);
    }

    // =========================
    // 3. RENVOYER OTP
    // =========================
    public function renvoyer(Request $request)
    {
        $request->validate([
            'telephone' => 'required|string|exists:users,telephone',
        ]);

        $user = User::where('telephone', $request->telephone)->first();

        if (!$user) {
            return response()->json([
                'message' => 'Utilisateur introuvable !'
            ], 404);
        }

        $lastOtp = OtpVerification::where('telephone', $request->telephone)
            ->where('type', 'connexion')
            ->orderBy('created_at', 'desc')
            ->first();

        if ($lastOtp && $lastOtp->created_at > Carbon::now()->subMinute()) {
            return response()->json([
                'message' => 'Attendez 1 minute avant de renvoyer !'
            ], 429);
        }

        OtpVerification::where('telephone', $request->telephone)
            ->where('type', 'connexion')
            ->delete();

        $code = rand(100000, 999999);

        OtpVerification::create([
            'telephone'      => $request->telephone,
            'code'           => $code,
            'expire_at'      => Carbon::now()->addMinutes(10),
            'est_utilise'    => false,
            'type'           => 'connexion',
            'id_utilisateur' => $user->utilisateur_id,
        ]);

        return response()->json([
            'message'   => 'Nouveau OTP envoyé !',
            'otp_dev'   => $code,
            'expire_at' => Carbon::now()->addMinutes(10),
        ]);
    }
}
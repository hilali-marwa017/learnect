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
    // Envoyer OTP
    public function envoyer(Request $request)
    {
        $request->validate([
            'telephone' => 'required|string|unique:users,telephone',
            'type'      => 'required|in:inscription,connexion',
        ]);

        $user = User::where('telephone', $request->telephone)->first();

        if (!$user) {
            return response()->json([
                'message' => 'Utilisateur introuvable !'
            ], 404);
        }

        // Supprimer anciens OTP
        OtpVerification::where('telephone', $request->telephone)
            ->where('type', $request->type)
            ->delete();

        // Générer code
        $code = rand(100000, 999999);

        // Sauvegarder OTP
        OtpVerification::create([
            'telephone'      => $request->telephone,
            'code'           => $code,
            'expire_at'      => Carbon::now()->addMinutes(10),
            'est_utilise'    => false,
            'type'           => $request->type,
            'id_utilisateur' => $user->utilisateur_id,
        ]);

        // DEV MODE (sans Twilio)
        return response()->json([
            'message'   => 'Code OTP généré !',
            'otp_dev'   => $code,
            'expire_at' => Carbon::now()->addMinutes(10),
        ], 201);
    }

    // Vérifier OTP
    public function verifier(Request $request)
    {
        $request->validate([
            'telephone' => 'required|string',
            'code'      => 'required|string',
            'type'      => 'required|in:inscription,connexion',
        ]);

        // Chercher OTP valide
        $otp = OtpVerification::where('telephone', $request->telephone)
            ->where('code', $request->code)
            ->where('type', $request->type)
            ->where('est_utilise', false)
            ->where('expire_at', '>', Carbon::now())
            ->first();

        if (!$otp) {
            return response()->json([
                'message' => 'Code OTP invalide ou expiré !'
            ], 400);
        }

        // Marquer utilisé
        $otp->update([
            'est_utilise' => true
        ]);

        // Récupérer user
        $user = User::find($otp->id_utilisateur);

        if (!$user) {
            return response()->json([
                'message' => 'Utilisateur introuvable !'
            ], 404);
        }

        // Activer compte si nécessaire
        if ($user->statut === 'en_attente') {
            $user->update([
                'statut' => 'actif'
            ]);
        }

        // Générer token
        $token = $user->createToken('learnect-token')->plainTextToken;

        return response()->json([
            'message' => 'Téléphone vérifié avec succès !',
            'user'    => $user,
            'token'   => $token,
        ]);
    }

    // Renvoyer OTP
    public function renvoyer(Request $request)
    {
        $request->validate([
            'telephone' => 'required|string|exists:users,telephone',
            'type'      => 'required|in:inscription,connexion',
        ]);

        $user = User::where('telephone', $request->telephone)->first();

        if (!$user) {
            return response()->json([
                'message' => 'Utilisateur introuvable !'
            ], 404);
        }

        // Anti spam
        $dernierOtp = OtpVerification::where('telephone', $request->telephone)
            ->where('type', $request->type)
            ->where('est_utilise', false)
            ->orderBy('created_at', 'desc')
            ->first();

        if (
            $dernierOtp &&
            $dernierOtp->created_at > Carbon::now()->subMinute()
        ) {
            return response()->json([
                'message' => 'Attendez 1 minute avant de renvoyer !'
            ], 429);
        }

        // Supprimer anciens OTP
        OtpVerification::where('telephone', $request->telephone)
            ->where('type', $request->type)
            ->delete();

        // Nouveau code
        $code = rand(100000, 999999);

        // Sauvegarder
        OtpVerification::create([
            'telephone'      => $request->telephone,
            'code'           => $code,
            'expire_at'      => Carbon::now()->addMinutes(10),
            'est_utilise'    => false,
            'type'           => $request->type,
            'id_utilisateur' => $user->utilisateur_id,
        ]);

        // DEV MODE
        return response()->json([
            'message'   => 'Nouveau code OTP généré !',
            'otp_dev'   => $code,
            'expire_at' => Carbon::now()->addMinutes(10),
        ]);
    }
}
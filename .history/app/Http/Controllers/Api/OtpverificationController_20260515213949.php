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
            'telephone' => 'required|string',
            'type'      => 'required|in:inscription,connexion',
        ]);

        // Generer code OTP 6 chiffres
        $code = rand(100000, 999999);

        // Supprimer ancien OTP si existe
        OtpVerification::where('telephone', $request->telephone)->where('type', $request->type)->delete();

        // Creer nouveau OTP
        OtpVerification::create([
            'telephone'      => $request->telephone,
            'code'           => $code,
            'expire_at'      => Carbon::now()->addMinutes(10), // expire dans 10 min
            'est_utilise'    => false,
            'type'           => $request->type,
            'id_utilisateur' => Auth::id(),
        ]);

        // En developpement — simuler envoi SMS
        // En production — utiliser Twilio
        if (app()->environment('local')) {
            return response()->json([
                'message' => 'Code OTP envoyé !',
                'code'    => $code, // visible seulement en dev !
            ]);
        }

        // Production — Twilio
        $sid   = env('TWILIO_SID');
        $token = env('TWILIO_AUTH_TOKEN');
        $from  = env('TWILIO_PHONE_NUMBER');

        $twilio = new \Twilio\Rest\Client($sid, $token);
        $twilio->messages->create(
            '+212' . $request->telephone,
            [
                'from' => $from,
                'body' => "Votre code Learnect : $code (valable 10 minutes)"
            ]
        );

        return response()->json([
            'message' => 'Code OTP envoyé par SMS !'
        ]);
    }

    // Verifier OTP
    public function verifier(Request $request)
    {
        $request->validate([
            'telephone' => 'required|string',
            'code'      => 'required|string',
            'type'      => 'required|in:inscription,connexion',
        ]);

        // Cherche OTP valide
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

        // Marquer OTP comme utilise
        $otp->update(['est_utilise' => true]);

        // Activer le compte user
        $user = User::find($otp->id_utilisateur);

        if ($user && $user->statut === 'en_attente') {
            $user->update(['statut' => 'actif']);
        }

        return response()->json([
            'message' => 'Téléphone vérifié avec succès !',
            'user'    => $user,
        ]);
    }
}
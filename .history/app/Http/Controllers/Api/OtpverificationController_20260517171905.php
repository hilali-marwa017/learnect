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
    public function envoyer(Request $request){
        $request->validate([
            'telephone'=>'required|string|exists:users,telephone',
            'type'=>'required|in:inscription,connexion',
        ]);

        $user = User::where('telephone',$request->telephone)->first();

        if(!$user){
            return response()->json(['message'=>'Utilisateur introuvable !'],404);
        }

        // Supprimer anciens OTP
        OtpVerification::where('telephone',$request->telephone)->where('type',$request->type)->delete();

        // Generer code 6 chiffres
        $code = rand(100000,999999);

        // Creer OTP
        OtpVerification::create([
            'telephone'=>$request->telephone,
            'code'=>$code,
            'expire_at'=>Carbon::now()->addMinutes(10),
            'est_utilise'=>false,
            'type'=>$request->type,
            'id_utilisateur'=>$user->utilisateur_id,
        ]);

        // Twilio SMS
        $twilio = new \Twilio\Rest\Client(env('TWILIO_SID'),env('TWILIO_AUTH_TOKEN'));
        $twilio->messages->create(
            '+212'.ltrim($request->telephone,'0'),
            [
                'from'=>env('TWILIO_PHONE_NUMBER'),
                'body'=>"Votre code Learnect : $code (valable 10 minutes)"
            ]
        );

        return response()->json([
            'message'=>'Code OTP envoyé par SMS !',
            'otp_dev'=>$code,
            'expire_at'=>Carbon::now()->addMinutes(10),
        ]);
    }

    public function verifier(Request $request){
        $request->validate([
            'telephone'=>'required|string',
            'code'=>'required|string',
            'type'=>'required|in:inscription,connexion',
        ]);

        // Chercher OTP valide
        $otp = OtpVerification::where('telephone',$request->telephone)
                              ->where('code',$request->code)
                              ->where('type',$request->type)
                              ->where('est_utilise',false)
                              ->where('expire_at','>',Carbon::now())
                              ->first();

        if(!$otp){
            return response()->json([
                'message'=>'Code OTP invalide ou expiré !'],400);
        }

        // Marquer utilise
        $otp->update(['est_utilise'=>true]);

        // Activer compte
        $user = User::find($otp->id_utilisateur);
        if($user && $user->statut === 'en_attente'){
            $user->update(['statut'=>'actif']);
        }

        // Connecter + token
        Auth::login($user);
        $token = $user->createToken('learnect-token')->plainTextToken;

        return response()->json([
            'message'=>'Téléphone vérifié avec succès !',
            'user'=>$user,
            'token'=>$token,
        ]);
    }

    public function renvoyer(Request $request){
        $request->validate([
            'telephone'=>'required|string|exists:users,telephone',
            'type'=>'required|in:inscription,connexion',
        ]);

        $user = User::where('telephone',$request->telephone)->first();

        if(!$user){
            return response()->json(['message'=>'Utilisateur introuvable !'],404);
        }

        // Anti spam 1 minute
        $dernierOtp = OtpVerification::where('telephone',$request->telephone)
                                     ->where('type',$request->type)
                                     ->where('est_utilise',false)
                                     ->orderBy('created_at','desc')
                                     ->first();

        if($dernierOtp && $dernierOtp->created_at > Carbon::now()->subMinute()){
            return response()->json(['message'=>'Attendez 1 minute avant de renvoyer !'],429);
        }

        // Supprimer anciens
        OtpVerification::where('telephone',$request->telephone)->where('type',$request->type)->delete();

        $code = rand(100000,999999);

        OtpVerification::create([
            'telephone'=>$request->telephone,
            'code'=>$code,
            'expire_at'=>Carbon::now()->addMinutes(10),
            'est_utilise'=>false,
            'type'=>$request->type,
            'id_utilisateur'=>$user->utilisateur_id,
        ]);

        $twilio = new \Twilio\Rest\Client(env('TWILIO_SID'),env('TWILIO_AUTH_TOKEN'));
        $twilio->messages->create(
            '+212'.ltrim($request->telephone,'0'),
            [
                'from'=>env('TWILIO_PHONE_NUMBER'),
                'body'=>"Nouveau code Learnect : $code (valable 10 minutes)"
            ]
        );

        return response()->json([
            'message'=>'Nouveau code envoyé !',
            'otp_dev'=>$code,
            'expire_at'=>Carbon::now()->addMinutes(10),
        ]);
    }
}
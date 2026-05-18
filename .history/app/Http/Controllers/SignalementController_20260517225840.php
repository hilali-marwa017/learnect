<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Signalement;
use App\Models\Avis;
use Illuminate\Support\Facades\Auth;

class SignalementController extends Controller
{

    public function store(Request $request){
        $request->validate([
            'motif'=>'required|string|min:10',
            'id_avis'=>'required|exists:avis,id_avis',
        ]);

        $avis = Avis::find($request->id_avis);

        if (!$avis){
            return response()->json([
                'message'=>'Avis introuvable !'
            ],404);
        }

        // ne peut pas signaler son propre avis
        if ($avis->id_utilisateur === Auth::id()){
            return response()->json([
                'message'=>'Vous ne pouvez pas signaler votre propre avis !'
            ],403);
        }

        // verifier pas deja signalee
        $dejaSignale = Signalement::where('id_avis',$request->id_avis)->where('id_signaleur',Auth::id())->first();

        if ($dejaSignale){
            return response()->json([
                'message'=>'Vous avez déjà signalé cet avis !'
            ],400);
        }

        $signalement = Signalement::create([
            'motif'=>$request->motif,
            'statut'=>'en_attente',
            'id_avis'=>$request->id_avis,
            'id_signaleur'=>Auth::id(),
        ]);

        return response()->json([
            'message'=>"Signalement envoyé ! L'admin va vérifier.",
            'signalement'=>$signalement,
        ],201);
    }

     //liste des signalement pour admin
   
    public function index(){
        $signalements = Signalement::with('avis','signaleur')->where('statut','en_attente')->orderBy('created_at','desc')->get();

        return response()->json($signalements);
    }

    //traitement d'avis par admin
    public function traiter(Signalement $signalement){
        $signalement->update(['statut'=>'traite']);
        return response()->json([
            'message'=>'Signalement traité !
        ']);
    }

    /*
    * destroy() — admin supprime le signalement
    * si il decide que l'avis est correct
    */
    public function destroy(Signalement $signalement){
        $signalement->delete();
        return response()->json(['message'=>'Signalement supprimé !']);
    }
}
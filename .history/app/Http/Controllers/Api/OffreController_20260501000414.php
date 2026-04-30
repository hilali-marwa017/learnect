<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Offre;
use App\Models\Demande;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class OffreController extends Controller
{
    public function index($id_demande){
        //verifier que la demamde existe
        $demande = Demande::find($id_demande);

        if(!$demande){
            return response()->json([
                'message'=>'Demande introuvable !'
            ],404);
        }

        //charge les offres avec les infos de l'enseignant 
        $offres = Offre::with('enseignant.user')->where('id_demande',$id_demande)->get();
        return response()->json($offres);
    }

    //mes offres (enseignant connectee)
    public function mesOfrres(){
        $offres = Offre::with('demande')->where('id_enseignant',Auth::id())->get();
        return response()->json($offres);
    }

    //envoyer une offre
    public function store(Request $request){
        $request->validate([
            'prix'=>'required|numeric|min:0',
            'message'=>'required|string',
            'id_demande'=>'required|exists:demandes,id_demande',
        ]);

        // verifier que la demande est active
        $demande = Demande::where('id_demande', $request->id_demande)->where('statut', 'active')->first();
        if (!$demande){
            return response()->json([
                'message'=>'Demande introuvable ou expirée !'
            ],404);
        }

        // verifier que l'enseignant n'a pas deja envoye une offre
        $offreExistante = Offre::where('id_demande', $request->id_demande)->where('id_enseignant', Auth::id())->first();
        if ($offreExistante) {
            return response()->json([
                'message'=>'Vous avez déjà envoyé une offre !'
            ],400);
        }
        $offre = Offre::create([
            'prix'=>$request->prix,
            'message'=> $request->message,
            'statut'=>'en_attente',
            'id_demande'=>$request->id_demande,
            'id_enseignant'=>Auth::id(),
        ]);

        return response()->json([
            'message'=>'Offre envoyée avec succès !',
            'offre'=>$offre,
        ],201);
    }
    //accepter une offre
    public function accepter($id){
        $offre = Offre::where('id_offre',$id)->first();

        if (!$offre){
            return response()->json([
                'message'=>'Offre introuvable !'
            ],404);
        }
        //accepter une offre
        $offre->update(['statut'=>'acceptee']);

        // refuser toutes les autres offres de cette demande
        Offre::where('id_demande', $offre->id_demande)
             ->where('id_offre', '!=', $id)
             ->update(['statut' => 'refusee']);

    }
    
}

<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Demande;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;


class DemandeController extends Controller
{
    //liste de toutes les demandes
    public function index(){
        $demandes = Demande::with('etudiant')->where('statut','active')->where('expire_at', '>' , Carbon::now())->get();//get current date nd time
        return response()->json($demandes);
    }

    //mes demandes (etudiant connectee)
    public function mesDemandes(){
        //charge les offres recues pour chaque demandes
        $demandes = Demande::with('offres')->where('id_utilisateur', Auth::id())->get();
        return response()->json($demandes);
    }

    //publier une demande
    public function store(Request $request){
        $request->validate([
            'matiere'=>'required|string',
            'niveau'=>'required|string',
            'budgetMin'=>'required|numeric|min:0',
            'budgetMax'=>'required|numeric|min:0|gte:budgetMin', // >=
            'ville'=>'required|string',
        ]);

        $demande = Demande::Create([
            'matiere'=>$request->matiere,
            'niveau'=>$request->niveau,
            'budgetMin'=>$request->budgetMin,
            'budgetMax'=>$request->budgetMax,
            'ville'=>$request->ville,
            'statut'=>'active',
            'expire_at'=>Carbon::now()->addHours(48), //apres 48h la demande expire automatiquement
            'id_utilisateur'=>Auth::id(),
        ]);

        return response()->json([
            'message'=>'Demande publiée avec succès !',
            'demande'=>$demande,
        ], 201);
    }

    //supprimer une demande
    public function destroy($id){
        $demande = 
    }
    
}

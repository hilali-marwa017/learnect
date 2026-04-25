<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Enseignant; //pour acceder a la table enseignant
use App\Models\User;//pour acceder a la table users
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;

class EnseignantController extends Controller
{
    //liste des enseignants
    public function index(Request $request){
        // query demarre une requete sur la table enseignants
        $query = Enseignant::query();
        $query->with('user','matieres');
        $query->where('estVerifie','true')->where('statut_annonce','en_ligne');

        if($request->filled('tarif_max')){
            $query->where('tarifHeure','<=', $request->tarif_max);
        }

        if($request->filled('cours_enligne')){
            $query->where('cours_enligne','true');
        }
        if($request->filled('cours_domicile')){
            $query->where('cours_domicile','true');
        }
        if($request->filled('note_min')){
            $query->where('noteMoyenne' ,'>=',$request->note_min);
        }

        $enseignants = $query->get();
        return response()->json($enseignants); //recuperation des donnees depuis la db et la renvoie sous forme de json
    }
    //profil enseignant
    public function show($id){
        $enseignant = Enseignant::with('user','matieres','avis','creneaux')->where('utilisateur_id',$id)->first();

        if(!$enseignant){
            return response()->json([
                'message'=>'Enseignant introuvable !'
            ],404);
        }

        return response()->json($enseignant);
    }

    // completer profil enseignant
    public function completeProfile(Request $request){
        //validation
        $request->validate([
            'titre'=>'required|string|min:10',
            'description_cours'=>'required|string|min:30',
            'description_profil'=>'required|string|min:30',
            'tarifHeure'=>'required|numeric|min:5',
            'langues'=>'required|string'
        ]);

        $enseignant = Enseignant::where('utilisateur_id',Auth::id())->first();
        $enseignant->update([
            'titre'->$request->titre,
            'description_cours'->$re

        ]);


    }

    
}

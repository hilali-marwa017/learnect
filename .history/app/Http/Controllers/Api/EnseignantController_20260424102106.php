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
        if($request->filled('note_'))

 
    }

    
}

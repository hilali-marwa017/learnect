<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Avis;
use App\Models\Reservation;
use App\Models\Enseignant;
use Illuminate\Support\Facades\Auth;

class AvisController extends Controller
{
    //liste des avis d'un enseignant
    public function index($id_enseignant){
        $enseignant = Enseignant::find($id_enseignant); //pk

        if (!$enseignant) {
            return response()->json([
                'message'=>'Enseignant introuvable !'
            ],404);
        }

        //charge les avis avec les infos de l'etudiant
        $avis = Avis::with('etudiant')->where('id_enseignant',$id_enseignant)->get();

        return response()->json($avis);

    }

    //creer un avis
    public function store(Request $reques)
}

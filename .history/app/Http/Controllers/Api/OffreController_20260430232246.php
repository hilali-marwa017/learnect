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
    }
    
}

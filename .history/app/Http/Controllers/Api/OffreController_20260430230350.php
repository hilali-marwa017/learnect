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
                'message' => 'Demande introuvable !'
            ], 404);
        }
    }
    
}

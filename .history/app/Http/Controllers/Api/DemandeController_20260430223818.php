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
        $demandes = Demande::with('etudiant')->where('statut','active')->where('expire_at', '>' , Carbon::now())->get();//

    }
    
}

<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Enseignant;
use App\Models\Reservation;
use App\Models\Avis;
use App\Models\Paiement;
use App\Models\Demande;


class AdminController extends Controller
{
    public function stats(){
        return response()->json([
            'total_etudiants'=>User::where('role','etudiant')->count(),
            'total_enseignants'=>User::where('role', 'enseignant')->count(),
            'total_reservations'=>Reservation::count(),
            'total_avis' => Avis::count(),
            'revenus_total'=>Paiement::where('statut','paye')->sum('comission'),
        ]);

    }

    public function Users(Request $request){
        $query = User::query();

        if()

    }
}

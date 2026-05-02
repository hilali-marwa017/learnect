<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Reservation;
use App\Models\Creneau;
use App\Models\Paiement;
use App\Models\Offre;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ReservationController extends Controller
{
    //liste des reservations (etudiant connectee)
    public function index(){
        $reservations = Reservation::with('creneau.enseignant.user','paiment')->where('id_utilisateur',Auth::id())->get();//charger les reservations de l'utilisateur connectee avec toutes les relations necessaires (creneau (horaire de cours), info du prof (user), detail du paiment associee)
        return response()->json($reservations);
    }

    //reserver un cours
    public function store(Request $request){
        $request
    }
}

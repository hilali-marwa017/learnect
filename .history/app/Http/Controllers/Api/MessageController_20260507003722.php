<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Message;
use App\Models\Reservation;
use Illuminate\Support\Facades\Auth;

class MessageController extends Controller
{
    public function mesConversations(){
        $reservations = Reservation::with(['creneau.enseignant.user','etudiant','messages.expediteur'])->where('statut','confirmee')->where('id_utilisateur',Auth::id())->get();
        return response()->json($reservations);
    }

    public function index($id_reservation){
        $reservation = Rservation::with('creneau')->find($id_reservation);
        if (!$reservation) {
            return response()->json([
                'message'=>'Réservation introuvable !'
            ],404);
        }

        //recuperer id de l'enseignant d'une reservation
        $id_enseignant = $reservation->creneau->id_enseignant;
        //recuperer l'etudiant qui fait la reservation
        $id_etudiant = $reservation->id_utilisateur;


    }
}

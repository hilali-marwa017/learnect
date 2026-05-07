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

        //recuperer id de l'enseignant liee au creneau d'une reservation
        $id_enseignant = $reservation->creneau->id_enseignant;
        //recuperer id de l'etudiant qui a cree la reservation
        $id_etudiant = $reservation->id_utilisateur;
        //verifier user connectee (etudiant,enseignant) de cette reservation
        if (Auth::id() != $id_etudiant && Auth::id() != $id_enseignant) {
            return response()->json([
                'message'=>'Non autorisé !'
            ],403);
        }
        // recuperer les messages de cette reservation avec l'expediteur (ancien->recent)
        $messages = Message::with('expediteur')->where('id_reservation', $id_reservation)->orderBy('created_at','asc')->get();
        return response()->json($messages);

    }
    //ajouter msg
    public function store(Request $request){
        $request->validate([
            

        ]);

    }
}

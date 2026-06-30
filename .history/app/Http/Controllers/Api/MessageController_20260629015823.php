<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Message;
use App\Models\Reservation;
use App\Models\Notification;
use Illuminate\Support\Facades\Auth;

class MessageController extends Controller
{
    // Liste des conversations pour l'etudiant connecte
    public function mesConversations(){
        $reservations = Reservation::with(['creneau.enseignant.user','etudiant','messages.expediteur'])
            ->where('statut','confirmee')
            ->where('id_utilisateur',Auth::id())
            ->get();
        return response()->json($reservations);
    }

    // Recuperer les messages d'une reservation
    public function index($id_reservation){
        $reservation = Reservation::with('creneau')->find($id_reservation);
        if (!$reservation) {
            return response()->json(['message'=>'Reservation introuvable !'],404);
        }
        $id_enseignant = $reservation->creneau->id_enseignant;
        $id_etudiant = $reservation->id_utilisateur;
        if (Auth::id() != $id_etudiant && Auth::id() != $id_enseignant) {
            return response()->json(['message'=>'Non autorise !'],403);
        }
        $messages = Message::with('expediteur')
            ->where('id_reservation', $id_reservation)
            ->orderBy('created_at','asc')
            ->get();
        return response()->json($messages);
    }

    // Ajouter un message
    public function store(Request $request){
        $request->validate([
            'contenu'=>'required|string|max:1000',
            'id_destinataire'=>'required|exists:users,utilisateur_id',
            'id_reservation'=>'required|exists:reservations,id_reservation',
        ]);
        $reservation = Reservation::where('id_reservation',$request->id_reservation)
            ->where('statut','confirmee')
            ->first();
        if (!$reservation){
            return response()->json(['message'=>'Messages disponibles apres confirmation seulement !'],400);
        }
        $message = Message::create([
            'contenu'=>$request->contenu,
            'id_expediteur'=>Auth::id(),
            'id_destinataire'=>$request->id_destinataire,
            'id_reservation'=>$request->id_reservation,
        ]);
        Notification::create([
            'type' => 'message',
            'contenu' => 'Vous avez recu un nouveau message de ' . Auth::user()->prenom . ' ' . Auth::user()->nom,
            'est_lue' => false,
            'utilisateur_id' => $request->id_destinataire,
        ]);
        return response()->json([
            'message'=>'Message envoye avec succes !',
            'data'=>$message->load('expediteur'),
        ], 201);
    }

    // Supprimer un message
    public function destroy(Message $message){
        if($message->id_expediteur != Auth::id()){
            return response()->json(['message' => 'Non autorise !'],403);
        }
        $message->delete();
        return response()->json(['message'=>'Message supprime avec succes !']);
    }

    // Marquer les messages d'une reservation comme lus
    public function marquerCommeLu($id_reservation){
        $reservation = Reservation::with('creneau')->find($id_reservation);
        if (!$reservation) {
            return response()->json(['message'=>'Reservation introuvable !'],404);
        }
        $id_enseignant = $reservation->creneau->id_enseignant;
        $id_etudiant = $reservation->id_utilisateur;
        if (Auth::id() != $id_etudiant && Auth::id() != $id_enseignant) {
            return response()->json(['message'=>'Non autorise !'],403);
        }
        Message::where('id_reservation', $id_reservation)
            ->where('id_destinataire', Auth::id())
            ->where('est_lu', false)
            ->update(['est_lu' => true]);
        return response()->json(['message'=>'Messages marques comme lus !']);
    }

    // Compter les messages non lus de l'utilisateur connecte
    public function nonLus(){
        $count = Message::where('id_destinataire', Auth::id())
            ->where('est_lu', false)
            ->count();
        return response()->json(['non_lus' => $count], 200);
    }
}
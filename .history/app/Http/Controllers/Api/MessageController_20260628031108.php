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
    // Liste des conversations pour l'étudiant connecté
    public function mesConversations(){
        $reservations = Reservation::with(['creneau.enseignant.user','etudiant','messages.expediteur'])
            ->where('statut','confirmee')
            ->where('id_utilisateur',Auth::id())
            ->get();
        return response()->json($reservations);
    }

    // Récupérer les messages d'une réservation
    public function index($id_reservation){
        $reservation = Reservation::with('creneau')->find($id_reservation);
        if (!$reservation) {
            return response()->json(['message'=>'Réservation introuvable !'],404);
        }
        $id_enseignant = $reservation->creneau->id_enseignant;
        $id_etudiant = $reservation->id_utilisateur;
        if (Auth::id() != $id_etudiant && Auth::id() != $id_enseignant) {
            return response()->json(['message'=>'Non autorisé !'],403);
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
            return response()->json(['message'=>'Messages disponibles après confirmation seulement !'],400);
        }
        $message = Message::create([
            'contenu'=>$request->contenu,
            'id_expediteur'=>Auth::id(),
            'id_destinataire'=>$request->id_destinataire,
            'id_reservation'=>$request->id_reservation,
        ]);
        Notification::create([
            'type' => 'message',
            'contenu' => 'Vous avez reçu un nouveau message de ' . Auth::user()->prenom . ' ' . Auth::user()->nom,
            'est_lue' => false,
            'utilisateur_id' => $request->id_destinataire,
        ]);
        return response()->json([
            'message'=>'Message envoyé avec succès !',
            'data'=>$message->load('expediteur'),
        ], 201);
    }

    // Supprimer un message
    public function destroy(Message $message){
        if($message->id_expediteur != Auth::id()){
            return response()->json(['message' => 'Non autorisé !'],403);
        }
        $message->delete();
        return response()->json(['message'=>'Message supprimé avec succès !']);
    }

    // Marquer les messages d'une réservation comme lus
    public function marquerCommeLu($id_reservation){
        $reservation = Reservation::with('creneau')->find($id_reservation);
        if (!$reservation) {
            return response()->json(['message'=>'Réservation introuvable !'],404);
        }
        $id_enseignant = $reservation->creneau->id_enseignant;
        $id_etudiant = $reservation->id_utilisateur;
        if (Auth::id() != $id_etudiant && Auth::id() != $id_enseignant) {
            return response()->json(['message'=>'Non autorisé !'],403);
        }
        Message::where('id_reservation', $id_reservation)
            ->where('id_destinataire', Auth::id())
            ->where('est_lu', false)
            ->update(['est_lu' => true]);
        return response()->json(['message'=>'Messages marqués comme lus !']);
    }

    // Compter les messages non lus de l'utilisateur connecté
    public function nonLus(){
        try {
            $count = Message::where('id_destinataire', Auth::id())
                ->where('est_lu', false)
                ->count();
            return response()->json(['non_lus' => $count]);
        } catch (\Exception $e) {
            return response()->json(['non_lus' => 0], 200);
        }
    }
}
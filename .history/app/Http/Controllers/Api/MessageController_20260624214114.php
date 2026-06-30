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
    public function mesConversations(){
        $reservations = Reservation::with(['creneau.enseignant.user','etudiant','messages.expediteur'])
            ->where('statut','confirmee')
            ->where('id_utilisateur',Auth::id())
            ->get();
        return response()->json($reservations);
    }

    public function index($id_reservation){
        $reservation = Reservation::with('creneau')->find($id_reservation);
        if (!$reservation) {
            return response()->json([
                'message'=>'Réservation introuvable !'
            ],404);
        }

        // Récupérer id de l'enseignant lié au créneau d'une réservation
        $id_enseignant = $reservation->creneau->id_enseignant;
        // Récupérer id de l'étudiant qui a créé la réservation
        $id_etudiant = $reservation->id_utilisateur;
        // Vérifier l'utilisateur connecté (étudiant, enseignant) de cette réservation
        if (Auth::id() != $id_etudiant && Auth::id() != $id_enseignant) {
            return response()->json([
                'message'=>'Non autorisé !'
            ],403);
        }
        // Récupérer les messages de cette réservation avec l'expéditeur (ancien -> récent)
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
            return response()->json([
                'message'=>'Messages disponibles après confirmation seulement !'
            ],400);
        }

        $message = Message::create([
            'contenu'=>$request->contenu,
            'id_expediteur'=>Auth::id(), // sender
            'id_destinataire'=>$request->id_destinataire, // receiver
            'id_reservation'=>$request->id_reservation,
        ]);

        // 🔔 NOTIFICATION : Nouveau message reçu
        Notification::create([
            'type' => 'message',
            'contenu' => 'Vous avez reçu un nouveau message de ' . Auth::user()->prenom . ' ' . Auth::user()->nom,
            'est_lue' => false,
            'utilisateur_id' => $request->id_destinataire,
        ]);

        return response()->json([
            'message'=>'Message envoyé avec succès !',
            'data'=>$message->load('expediteur'), // Charger les infos de l'expéditeur liées au message
        ], 201);
    }

    // Supprimer un message
    public function destroy(Message $message){
        if($message->id_expediteur != Auth::id()){
            return response()->json([
                'message' => 'Non autorisé !'
            ],403);
        }       

        $message->delete();

        return response()->json([
            'message'=>'Message supprimé avec succès !'
        ]);
    }

    // 🔔 OPTIONNEL : Marquer les messages comme lus
    public function marquerCommeLu($id_reservation){
        $reservation = Reservation::with('creneau')->find($id_reservation);
        if (!$reservation) {
            return response()->json([
                'message'=>'Réservation introuvable !'
            ],404);
        }

        // Vérifier que l'utilisateur est bien impliqué dans cette réservation
        $id_enseignant = $reservation->creneau->id_enseignant;
        $id_etudiant = $reservation->id_utilisateur;
        
        if (Auth::id() != $id_etudiant && Auth::id() != $id_enseignant) {
            return response()->json([
                'message'=>'Non autorisé !'
            ],403);
        }

        // Marquer tous les messages non lus comme lus
        Message::where('id_reservation', $id_reservation)
            ->where('id_destinataire', Auth::id())
            ->where('est_lu', false)
            ->update(['est_lu' => true]);

        return response()->json([
            'message'=>'Messages marqués comme lus !'
        ]);
    }

    // 🔔 OPTIONNEL : Compter les messages non lus
    public function nonLus(){
        $count = Message::where('id_destinataire', Auth::id())
            ->where('est_lu', false)
            ->count();

        return response()->json([
            'non_lus' => $count
        ]);
    }
}
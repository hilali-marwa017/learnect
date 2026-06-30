<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Reservation;
use App\Models\Creneau;
use App\Models\Paiement;
use App\Models\Offre;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ReservationController extends Controller
{
    // Liste des réservations de l'étudiant connecté
    public function index(){
        $reservations = Reservation::with('creneau.enseignant.user','paiement')->where('id_utilisateur',Auth::id())->get();
        return response()->json($reservations);
    }

    // Réservations de l'enseignant
    public function mesReservationsEnseignant(){
        $creneaux = Creneau::with('reservations.etudiant','reservations.paiement')->where('id_enseignant',Auth::id())->get();
        return response()->json($creneaux);
    }

    // Créer une réservation
    public function store(Request $request){
        $request->validate([
            'id_creneau'=>'required|exists:creneaux,id_creneau',
            'date'=>'required|date|after:today',
            'id_offre'=>'nullable|exists:offres,id_offre',
            'methode'=>'required|in:simulation,cash', 
        ]);

        // Récupérer le créneau disponible
        $creneau = Creneau::where('id_creneau',$request->id_creneau)->where('estDisponible',true)->first();

        if(!$creneau){
            return response()->json([
                'message'=>'Créneau non disponible !'
            ],400);
        }

        // Ne peut pas réserver son propre cours
        if($creneau->id_enseignant == Auth::id()){
            return response()->json([
                'message'=>'Vous ne pouvez pas réserver votre propre cours !'
            ],403);
        }

        // Vérifier si c'est la 1ère réservation de l'utilisateur
        $dejaReserve = Reservation::where('id_utilisateur',Auth::id())->first();

        if(!$dejaReserve){
            $montant = 0; // 1er cours gratuit
        }
        elseif($request->id_offre){
            $offre = Offre::find($request->id_offre);
            $montant = $offre ? $offre->prix : $creneau->enseignant->tarifHeure;
        }
        else{
            $montant = $creneau->enseignant->tarifHeure;
        }

        // Création de la réservation
        $reservation = Reservation::create([
            'date'=>$request->date,
            'montant'=>$montant,
            'statut'=>'en_attente',
            'id_utilisateur'=>Auth::id(),
            'id_creneau'=>$request->id_creneau,
            'id_offre'=>$request->id_offre,
        ]);

        // Créneau indisponible après réservation
        $creneau->update(['estDisponible'=>false]);

        // Calcul de la commission 10%
        $comission = $montant * 0.10;

        // Créer un paiement
        Paiement::create([
            'montantTotal'=>$montant,
            'comission'=>$comission,
            'montantEnseignant'=>$montant-$comission,
            'methode'=>$request->methode,
            'statut'=>'en_attente',
            'id_reservation'=>$reservation->id_reservation,
        ]);

        // 🔔 NOTIFICATION : Nouvelle réservation créée
        Notification::create([
            'type' => 'reservation',
            'contenu' => 'Vous avez créé une nouvelle réservation pour le ' . $request->date,
            'est_lue' => false,
            'utilisateur_id' => Auth::id(),
        ]);

        // 🔔 NOTIFICATION : Enseignant notifié d'une nouvelle réservation
        Notification::create([
            'type' => 'reservation',
            'contenu' => 'Un étudiant a réservé votre cours du ' . $request->date,
            'est_lue' => false,
            'utilisateur_id' => $creneau->id_enseignant,
        ]);

        return response()->json([
            'message'=>'Réservation créée avec succès !',
            'reservation'=>$reservation,
            'methode'=>$request->methode, 
        ],201);
    }

    public function confirmerPaiement($id){
        $reservation = Reservation::with('creneau.enseignant.user')->where('id_reservation',$id)->where('id_utilisateur',Auth::id())->first();

        if(!$reservation){
            return response()->json([
                'message'=>'Réservation introuvable !'
            ],404);
        }

        if($reservation->statut !== 'en_attente'){
            return response()->json([
                'message'=>'Déjà traité !'
            ],400);
        }

        $reservation->update(['statut'=>'confirmee']);

        // Confirmer le paiement
        Paiement::where('id_reservation',$id)->update(['statut'=>'paye']);

        // 🔔 NOTIFICATION : Réservation confirmée pour l'étudiant
        Notification::create([
            'type' => 'reservation',
            'contenu' => 'Votre réservation a été confirmée par le professeur.',
            'est_lue' => false,
            'utilisateur_id' => $reservation->id_utilisateur,
        ]);

        // 🔔 NOTIFICATION : Paiement reçu pour l'enseignant
        Notification::create([
            'type' => 'paiement',
            'contenu' => 'Nouveau paiement reçu pour votre cours du ' . $reservation->date,
            'est_lue' => false,
            'utilisateur_id' => $reservation->creneau->id_enseignant,
        ]);

        // Récupérer le numéro de l'enseignant
        $telephone = $reservation->creneau->enseignant->user->telephone;

        // Récupérer la méthode de paiement
        $paiement = Paiement::where('id_reservation',$id)->first();

        // Message selon méthode
        if($paiement->methode === 'cash'){
            return response()->json([
                'message'=>'Réservation confirmée ! Payez en espèces lors du cours.',
                'reservation'=>$reservation,
                'whatsapp'=>$telephone,
                'methode'=>'cash',
                'montant'=>$paiement->montantTotal.' DH',
            ]);
        }

        return response()->json([
            'message'=>'Paiement simulé confirmé ! Voici le contact de votre prof.',
            'reservation'=>$reservation,
            'whatsapp'=>$telephone,
            'methode'=>'simulation',
            'montant'=>$paiement->montantTotal.' DH',
        ]);
    }

    // Annuler une réservation
    public function destroy($id){
        $reservation = Reservation::where('id_reservation',$id)->where('id_utilisateur',Auth::id())->first();

        if(!$reservation){
            return response()->json([
                'message'=>'Réservation introuvable !'
            ],404);
        }

        // Libérer le créneau
        Creneau::where('id_creneau',$reservation->id_creneau)->update(['estDisponible'=>true]);

        // Annuler la réservation
        $reservation->update(['statut'=>'annulee']);

        // 🔔 NOTIFICATION : Réservation annulée
        Notification::create([
            'type' => 'reservation',
            'contenu' => 'Vous avez annulé votre réservation du ' . $reservation->date,
            'est_lue' => false,
            'utilisateur_id' => Auth::id(),
        ]);

        // 🔔 NOTIFICATION : Enseignant notifié de l'annulation
        Notification::create([
            'type' => 'reservation',
            'contenu' => 'Un étudiant a annulé la réservation du ' . $reservation->date,
            'est_lue' => false,
            'utilisateur_id' => $reservation->creneau->id_enseignant,
        ]);

        return response()->json([
            'message'=>'Réservation annulée avec succès !'
        ]);
    }

    public function terminer($id){
        $reservation = Reservation::where('id_reservation',$id)->where('id_utilisateur',Auth::id())->where('statut','confirmee')->first();

        if(!$reservation){
            return response()->json([
                'message'=>'Réservation introuvable ou non confirmée !'
            ],404);
        }

        $reservation->update(['statut'=>'terminee']);

        // 🔔 NOTIFICATION : Cours terminé pour l'étudiant
        Notification::create([
            'type' => 'cours',
            'contenu' => 'Votre cours est terminé ! N\'oubliez pas de laisser un avis.',
            'est_lue' => false,
            'utilisateur_id' => $reservation->id_utilisateur,
        ]);

        // 🔔 NOTIFICATION : Cours terminé pour l'enseignant
        Notification::create([
            'type' => 'cours',
            'contenu' => 'Le cours du ' . $reservation->date . ' est terminé.',
            'est_lue' => false,
            'utilisateur_id' => $reservation->creneau->id_enseignant,
        ]);

        return response()->json([
            'message'=>'Cours terminé ! Vous pouvez maintenant laisser un avis.',
            'reservation'=>$reservation,
        ]);
    }
}
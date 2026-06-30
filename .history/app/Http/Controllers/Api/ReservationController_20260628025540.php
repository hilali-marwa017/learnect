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
    public function index()
    {
        $reservations = Reservation::with('creneau.enseignant.user', 'paiement')
            ->where('id_utilisateur', Auth::id())
            ->get();
        return response()->json($reservations);
    }

    // Réservations de l'enseignant
    public function mesReservationsEnseignant()
    {
        $creneaux = Creneau::with('reservations.etudiant', 'reservations.paiement')
            ->where('id_enseignant', Auth::id())
            ->get();
        return response()->json($creneaux);
    }

    // Créer une réservation
    public function store(Request $request)
    {
        $request->validate([
            'id_creneau' => 'required|exists:creneaux,id_creneau',
            'date' => 'required|date|after:today',
            'id_offre' => 'nullable|exists:offres,id_offre',
            'methode' => 'required|in:simulation,cash',
        ]);

        $creneau = Creneau::where('id_creneau', $request->id_creneau)
            ->where('estDisponible', true)
            ->first();

        if (!$creneau) {
            return response()->json(['message' => 'Créneau non disponible !'], 400);
        }

        if ($creneau->id_enseignant == Auth::id()) {
            return response()->json(['message' => 'Vous ne pouvez pas réserver votre propre cours !'], 403);
        }

        $dejaReserve = Reservation::where('id_utilisateur', Auth::id())->first();

        if (!$dejaReserve) {
            $montant = 0;
        } elseif ($request->id_offre) {
            $offre = Offre::find($request->id_offre);
            $montant = $offre ? $offre->prix : $creneau->enseignant->tarifHeure;
        } else {
            $montant = $creneau->enseignant->tarifHeure;
        }

        $reservation = Reservation::create([
            'date' => $request->date,
            'montant' => $montant,
            'statut' => 'en_attente',
            'id_utilisateur' => Auth::id(),
            'id_creneau' => $request->id_creneau,
            'id_offre' => $request->id_offre,
        ]);

        $creneau->update(['estDisponible' => false]);

        $comission = $montant * 0.10;

        Paiement::create([
            'montantTotal' => $montant,
            'comission' => $comission,
            'montantEnseignant' => $montant - $comission,
            'methode' => $request->methode,
            'statut' => 'en_attente',
            'id_reservation' => $reservation->id_reservation,
        ]);

        Notification::create([
            'type' => 'reservation',
            'contenu' => 'Vous avez créé une nouvelle réservation pour le ' . $request->date,
            'est_lue' => false,
            'utilisateur_id' => Auth::id(),
        ]);

        Notification::create([
            'type' => 'reservation',
            'contenu' => 'Un étudiant a réservé votre cours du ' . $request->date,
            'est_lue' => false,
            'utilisateur_id' => $creneau->id_enseignant,
        ]);

        return response()->json([
            'message' => 'Réservation créée avec succès !',
            'reservation' => $reservation,
            'methode' => $request->methode,
        ], 201);
    }

    public function confirmerPaiement($id)
    {
        $reservation = Reservation::with('creneau.enseignant.user')
            ->where('id_reservation', $id)
            ->where('id_utilisateur', Auth::id())
            ->first();

        if (!$reservation) {
            return response()->json(['message' => 'Réservation introuvable !'], 404);
        }

        if ($reservation->statut !== 'en_attente') {
            return response()->json(['message' => 'Déjà traité !'], 400);
        }

        $reservation->update(['statut' => 'confirmee']);

        Paiement::where('id_reservation', $id)->update(['statut' => 'paye']);

        Notification::create([
            'type' => 'reservation',
            'contenu' => 'Vous avez confirmé votre paiement. Votre cours est confirmé !',
            'est_lue' => false,
            'utilisateur_id' => $reservation->id_utilisateur,
        ]);

        Notification::create([
            'type' => 'paiement',
            'contenu' => 'Nouveau paiement reçu pour votre cours du ' . $reservation->date,
            'est_lue' => false,
            'utilisateur_id' => $reservation->creneau->id_enseignant,
        ]);

        $telephone = $reservation->creneau->enseignant->user->telephone;
        $paiement = Paiement::where('id_reservation', $id)->first();

        if ($paiement->methode === 'cash') {
            return response()->json([
                'message' => 'Réservation confirmée ! Payez en espèces lors du cours.',
                'reservation' => $reservation,
                'whatsapp' => $telephone,
                'methode' => 'cash',
                'montant' => $paiement->montantTotal . ' DH',
            ]);
        }

        return response()->json([
            'message' => 'Paiement simulé confirmé ! Voici le contact de votre prof.',
            'reservation' => $reservation,
            'whatsapp' => $telephone,
            'methode' => 'simulation',
            'montant' => $paiement->montantTotal . ' DH',
        ]);
    }

    public function destroy($id)
    {
        $reservation = Reservation::where('id_reservation', $id)
            ->where('id_utilisateur', Auth::id())
            ->first();

        if (!$reservation) {
            return response()->json(['message' => 'Réservation introuvable !'], 404);
        }

        Creneau::where('id_creneau', $reservation->id_creneau)->update(['estDisponible' => true]);
        $reservation->update(['statut' => 'annulee']);

        Notification::create([
            'type' => 'reservation',
            'contenu' => 'Vous avez annulé votre réservation du ' . $reservation->date,
            'est_lue' => false,
            'utilisateur_id' => Auth::id(),
        ]);

        Notification::create([
            'type' => 'reservation',
            'contenu' => 'Un étudiant a annulé la réservation du ' . $reservation->date,
            'est_lue' => false,
            'utilisateur_id' => $reservation->creneau->id_enseignant,
        ]);

        return response()->json(['message' => 'Réservation annulée avec succès !']);
    }

    // ✅ CORRIGE : type 'cours' → 'reservation'
    public function terminer($id)
    {
        $reservation = Reservation::where('id_reservation', $id)
            ->where('id_utilisateur', Auth::id())
            ->where('statut', 'confirmee')
            ->first();

        if (!$reservation) {
            return response()->json(['message' => 'Réservation introuvable ou non confirmée !'], 404);
        }

        $reservation->update(['statut' => 'terminee']);

        // Notification étudiant
        Notification::create([
            'type' => 'reservation',
            'contenu' => 'Votre cours est terminé ! N\'oubliez pas de laisser un avis.',
            'est_lue' => false,
            'utilisateur_id' => $reservation->id_utilisateur,
        ]);

        // Notification enseignant
        Notification::create([
            'type' => 'reservation',
            'contenu' => 'Le cours du ' . $reservation->date . ' est terminé.',
            'est_lue' => false,
            'utilisateur_id' => $reservation->creneau->id_enseignant,
        ]);

        return response()->json([
            'message' => 'Cours terminé ! Vous pouvez maintenant laisser un avis.',
            'reservation' => $reservation,
        ]);
    }
}
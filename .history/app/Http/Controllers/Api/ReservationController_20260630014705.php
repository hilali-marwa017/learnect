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
use Carbon\Carbon;

class ReservationController extends Controller
{
    public function index()
    {
        $reservations = Reservation::with('creneau.enseignant.user', 'paiement')
            ->where('id_utilisateur', Auth::id())
            ->get();
        return response()->json($reservations);
    }

    public function mesReservationsEnseignant()
    {
        $creneaux = Creneau::with('reservations.etudiant', 'reservations.paiement')
            ->where('id_enseignant', Auth::id())
            ->get();
        return response()->json($creneaux);
    }

    public function store(Request $request)
    {
        $request->validate([
            'id_creneau' => 'required|exists:creneaux,id_creneau',
            'date'       => 'required|date|after:today',
            'id_offre'   => 'nullable|exists:offres,id_offre',
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
            $offre   = Offre::find($request->id_offre);
            $montant = $offre ? $offre->prix : $creneau->enseignant->tarifHeure;
        } else {
            $montant = $creneau->enseignant->tarifHeure;
        }

        $reservation = Reservation::create([
            'date' => $request->date,
            'montant'=> $montant,
            'statut'=> 'en_attente',
            'id_utilisateur'=> Auth::id(),
            'id_creneau' => $request->id_creneau,
            'id_offre'      => $request->id_offre,
        ]);

        $creneau->update(['estDisponible' => false]);

        $comission = $montant * 0.10;

        Paiement::create([
            'montantTotal' => $montant,
            'comission' => $comission,
            'montantEnseignant' => $montant - $comission,
            'methode' => 'simulation',
            'statut' => 'en_attente',
            'id_reservation' => $reservation->id_reservation,
        ]);

        Notification::create([
            'type'          => 'reservation',
            'contenu'       => 'Vous avez créé une nouvelle réservation pour le ' . $request->date . '. En attente de paiement.',
            'est_lue'       => false,
            'utilisateur_id'=> Auth::id(),
        ]);

        Notification::create([
            'type'          => 'reservation',
            'contenu'       => 'Un étudiant a réservé votre cours du ' . $request->date . '. En attente de paiement.',
            'est_lue'       => false,
            'utilisateur_id'=> $creneau->id_enseignant,
        ]);

        return response()->json([
            'message'     => 'Réservation créée avec succès !',
            'reservation' => $reservation,
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

        Paiement::where('id_reservation', $id)->update(['statut' => 'paye']);

        $reservation->update(['statut' => 'paiement_recu']);

        $paiement = Paiement::where('id_reservation', $id)->first();

        Notification::create([
            'type'          => 'paiement',
            'contenu'       => 'Votre paiement de ' . $paiement->montantTotal . ' DH a été reçu. En attente de confirmation du professeur.',
            'est_lue'       => false,
            'utilisateur_id'=> $reservation->id_utilisateur,
        ]);

        Notification::create([
            'type'          => 'paiement',
            'contenu'       => 'Nouveau paiement de ' . $paiement->montantTotal . ' DH reçu pour votre cours du ' . $reservation->date . '. Veuillez accepter ou refuser la réservation.',
            'est_lue'       => false,
            'utilisateur_id'=> $reservation->creneau->id_enseignant,
        ]);

        return response()->json([
            'message'     => 'Paiement confirmé ! En attente de validation du professeur.',
            'reservation' => $reservation,
            'methode'     => 'simulation',
            'montant'     => $paiement->montantTotal . ' DH',
            'whatsapp'    => $reservation->creneau->enseignant->user->telephone ?? null,
        ]);
    }

    public function accepterReservation($id)
    {
        $reservation = Reservation::with('creneau', 'etudiant')
            ->whereHas('creneau', function ($q) {
                $q->where('id_enseignant', Auth::id());
            })
            ->where('id_reservation', $id)
            ->where('statut', 'paiement_recu')
            ->first();

        if (!$reservation) {
            return response()->json(['message' => 'Réservation introuvable ou non éligible !'], 404);
        }

        $reservation->update(['statut' => 'confirmee']);

        Notification::create([
            'type'          => 'reservation',
            'contenu'       => 'Votre réservation du ' . $reservation->date . ' a été acceptée par le professeur ! Votre cours est confirmé.',
            'est_lue'       => false,
            'utilisateur_id'=> $reservation->id_utilisateur,
        ]);

        Notification::create([
            'type'          => 'reservation',
            'contenu'       => 'Vous avez accepté la réservation du ' . $reservation->date . '.',
            'est_lue'       => false,
            'utilisateur_id'=> Auth::id(),
        ]);

        return response()->json([
            'message'     => 'Réservation acceptée avec succès !',
            'reservation' => $reservation,
        ]);
    }

    public function refuserReservation($id)
    {
        $reservation = Reservation::with('creneau', 'etudiant')
            ->whereHas('creneau', function ($q) {
                $q->where('id_enseignant', Auth::id());
            })
            ->where('id_reservation', $id)
            ->where('statut', 'paiement_recu')
            ->first();

        if (!$reservation) {
            return response()->json(['message' => 'Réservation introuvable ou non éligible !'], 404);
        }

        $reservation->update(['statut' => 'annulee']);

        Paiement::where('id_reservation', $id)->update(['statut' => 'rembourse']);

        Creneau::where('id_creneau', $reservation->id_creneau)
            ->update(['estDisponible' => true]);

        Notification::create([
            'type'          => 'reservation',
            'contenu'       => 'Votre réservation du ' . $reservation->date . ' a été refusée par le professeur. Votre paiement sera remboursé sous 3-5 jours.',
            'est_lue'       => false,
            'utilisateur_id'=> $reservation->id_utilisateur,
        ]);

        Notification::create([
            'type'          => 'reservation',
            'contenu'       => 'Vous avez refusé la réservation du ' . $reservation->date . '. Le paiement de l\'étudiant sera remboursé.',
            'est_lue'       => false,
            'utilisateur_id'=> Auth::id(),
        ]);

        return response()->json([
            'message' => 'Réservation refusée. Remboursement initié.',
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

        if ($reservation->statut === 'paiement_recu' || $reservation->statut === 'confirmee') {
            Paiement::where('id_reservation', $id)->update(['statut' => 'rembourse']);
        }

        Creneau::where('id_creneau', $reservation->id_creneau)
            ->update(['estDisponible' => true]);

        $reservation->update(['statut' => 'annulee']);

        Notification::create([
            'type'          => 'reservation',
            'contenu'       => 'Vous avez annulé votre réservation du ' . $reservation->date . '.',
            'est_lue'       => false,
            'utilisateur_id'=> Auth::id(),
        ]);

        Notification::create([
            'type'          => 'reservation',
            'contenu'       => 'Un étudiant a annulé la réservation du ' . $reservation->date . '.',
            'est_lue'       => false,
            'utilisateur_id'=> $reservation->creneau->id_enseignant,
        ]);

        return response()->json(['message' => 'Réservation annulée avec succès !']);
    }

    public function terminer($id)
    {
        $reservation = Reservation::with('creneau')
            ->where('id_reservation', $id)
            ->where('id_utilisateur', Auth::id())
            ->where('statut', 'confirmee')
            ->first();

        if (!$reservation) {
            return response()->json(['message' => 'Réservation introuvable ou non confirmée !'], 404);
        }

        $heureFin  = $reservation->creneau->heureFin;
        $dateFin   = Carbon::parse($reservation->date . ' ' . $heureFin);

        if ($dateFin->isFuture()) {
            return response()->json([
                'message' => 'Vous ne pouvez pas terminer ce cours avant ' . Carbon::parse($heureFin)->format('H:i') . '.'
            ], 422);
        }

        $reservation->update(['statut' => 'terminee']);

        Notification::create([
            'type'          => 'reservation',
            'contenu'       => 'Votre cours est terminé ! N\'oubliez pas de laisser un avis.',
            'est_lue'       => false,
            'utilisateur_id'=> $reservation->id_utilisateur,
        ]);

        Notification::create([
            'type'          => 'reservation',
            'contenu'       => 'Le cours du ' . $reservation->date . ' est terminé.',
            'est_lue'       => false,
            'utilisateur_id'=> $reservation->creneau->id_enseignant,
        ]);

        return response()->json([
            'message'     => 'Cours terminé ! Vous pouvez maintenant laisser un avis.',
            'reservation' => $reservation,
        ]);
    }
}
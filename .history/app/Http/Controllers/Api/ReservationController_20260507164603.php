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
    public function index(){
        $reservations = Reservation::with('creneau.enseignant.user', 'paiement')->where('id_utilisateur', Auth::id())->get();
        return response()->json($reservations);
    }

    
    public function mesReservationsEnseignant(){
        $creneaux = Creneau::with('reservations.etudiant', 'reservations.paiement')->where('id_enseignant', Auth::id())->get();
        return response()->json($creneaux);
    }

    public function store(Request $request){
        $request->validate([
            'id_creneau'=>'required|exists:creneaux,id_creneau',
            'date'       =>'required|date|after:today',
            'id_offre'   =>'nullable|exists:offres,id_offre',
        ]);

        $creneau = Creneau::where('id_creneau', $request->id_creneau)
                          ->where('estDisponible', true)
                          ->first();

        if (!$creneau) {
            return response()->json(['message' => 'Créneau non disponible !'], 400);
        }

        if ($creneau->id_enseignant == Auth::id()) {
            return response()->json([
                'message' => 'Vous ne pouvez pas réserver votre propre cours !'
            ], 403);
        }

        // ✅ 1er cours gratuit
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
            'date'           => $request->date,
            'montant'        => $montant,
            'statut'         => 'en_attente',
            'id_utilisateur' => Auth::id(),
            'id_creneau'     => $request->id_creneau,
            'id_offre'       => $request->id_offre,
        ]);

        $creneau->update(['estDisponible' => false]);

        $comission = $montant * 0.10;

        Paiement::create([
            'montantTotal'      => $montant,
            'comission'         => $comission,
            'montantEnseignant' => $montant - $comission,
            'methode'           => 'simulation',
            'statut'            => 'en_attente',
            'id_reservation'    => $reservation->id_reservation,
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
            return response()->json(['message' => 'Réservation déjà confirmée ou annulée !'], 400);
        }

        $reservation->update(['statut' => 'confirmee']);
        Paiement::where('id_reservation', $id)->update(['statut' => 'paye']);

        $telephone = $reservation->creneau->enseignant->user->telephone;

        return response()->json([
            'message'     => 'Paiement confirmé ! Voici le contact de votre prof.',
            'reservation' => $reservation,
            'whatsapp'    => $telephone,
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

        Creneau::where('id_creneau', $reservation->id_creneau)
               ->update(['estDisponible' => true]);

        $reservation->update(['statut' => 'annulee']);

        return response()->json(['message' => 'Réservation annulée avec succès !']);
    }
}
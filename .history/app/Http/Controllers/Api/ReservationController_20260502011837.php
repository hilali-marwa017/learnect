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
    // liste des reservations (etudiant connectee)
    public function index(){
        $reservations = Reservation::with('creneau.enseignant.user','paiement')->where('id_utilisateur', Auth::id())->get();
        return response()->json($reservations);
    }

    public function store(Request $request){
    // validation
    $request->validate([
        'id_creneau' => 'required|exists:creneaux,id_creneau',
        'date'       => 'required|date|after:today|before:+1 year',
        'id_offre'   => 'nullable|exists:offres,id_offre',
    ]);

    // 2. Recuperer le creneau
    $creneau = Creneau::where('id_creneau', $request->id_creneau)
                      ->where('estDisponible', true)
                      ->first();

    if (!$creneau) {
        return response()->json([
            'message' => 'Créneau non disponible !'
        ], 400);
    }

    // 3. Calculer le montant
    $montant = $creneau->enseignant->tarifHeure;

    if ($request->id_offre) {
        $offre = Offre::find($request->id_offre);
        if (!$offre) {
            return response()->json([
                'message' => 'Offre introuvable !'
            ], 404);
        }
        $montant = $offre->prix;
    }

    // 4. Creer la reservation
    $reservation = Reservation::create([
        'date'           => $request->date,
        'montant'        => $montant,
        'statut'         => 'en_attente',
        'id_utilisateur' => Auth::id(),
        'id_creneau'     => $request->id_creneau,
        'id_offre'       => $request->id_offre,
    ]);

    // 5. Marquer le creneau indispo
    $creneau->update(['estDisponible' => false]);

    // 6. Creer le paiement simule
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
    // confirmer paiement — reveler numero whatsapp
    public function confirmerPaiement($id){
        $reservation = Reservation::with('creneau.enseignant.user')->where('id_reservation', $id)->where('id_utilisateur', Auth::id())->first();

        if (!$reservation){
            return response()->json([
                'message' => 'Réservation introuvable !'
            ], 404);
        }

        // confirmer la reservation
        $reservation->update(['statut'=>'confirmee']);

        // confirmer le paiement
        Paiement::where('id_reservation', $id)->update(['statut'=>'paye']);

        // reveler le numero de l'enseignant
        $telephone = $reservation->creneau->enseignant->user->telephone;

        return response()->json([
            'message'=>'Paiement confirmé ! Voici le contact de votre prof.',
            'reservation'=>$reservation,
            'whatsapp'=>$telephone,
        ]);
    }

    public function destroy($id){
        $reservation = Reservation::where('id_reservation', $id)->where('id_utilisateur', Auth::id())->first();

        if (!$reservation) {
            return response()->json([
                'message'=>'Réservation introuvable !'
            ],404);
        }

        // libérer creneau
        Creneau::where('id_creneau', $reservation->id_creneau)->update(['estDisponible'=>true]);

        // annuler reservation
        $reservation->update(['statut'=>'annulee']);

        return response()->json([
            'message'=>'Réservation annulée avec succès !'
        ]);
    }
}
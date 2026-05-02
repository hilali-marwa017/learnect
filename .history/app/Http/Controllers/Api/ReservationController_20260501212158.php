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
    //liste des reservations (etudiant connectee)
    public function index(){
        $reservations = Reservation::with('creneau.enseignant.user','paiment')->where('id_utilisateur',Auth::id())->get();//charger les reservations de l'utilisateur connectee avec toutes les relations necessaires (creneau (horaire de cours), info du prof (user), detail du paiment associee)
        return response()->json($reservations);
    }

    //reserver un cours
    public function store(Request $request){//dependency injection (laravel injecte automatiquement objet Request pour recuperer les donnees du client)
        $request->validate([
            'id_creneau'=>'required|exists:creneaux,id_creneau',
            'date'=>'required|date|after:today|before:+1 year',
            'id_offre'=>'nullable|exists:offres,id_offre',
        ]);

        // verifier que le creneau est disponible
        if (!$creneau) {
            return response()->json([
                'message'=>'Créneau non disponible !'
            ],400);
        }

        //calculer le montant
        $montant = $creneau->enseignant->tarifHeure;//  prix de base de l'enseignant
         if ($request->id_offre){
            $offre = Offre::find($request->id_offre);
            $montant = $offre->prix; // prixs de l'offre s' elle existe
        }

        //creer la reservation
        $reservation = Reservation::create([
            'date'=>$request->date,
            'montant'=>$montant,
            'statut'=>'en_attente',
            'id_utilisateur'=>Auth::id(),
            'id_creneau'=>$request->id_creneau,
            'id_offre'=>$request->id_offre,
        ]);

        //marquer le creneau indispo
        $creneau->update(['estDisponible'=>false]);

        //creer le paiment simulee
        $comission = $montant*0.10;

        Paiement::create([
            'montantTotal'=>$montant,
            'comission'=>$comission,
            'montantEnseignant'=>$montant - $comission,
            'methode'=>'simulation',
            'statut'=>'en_attente',
            'id_reservation'=>$reservation->id_reservation,
        ]);

        return response()->json([
            'message'=>'Réservation créée avec succès !',
            'reservation'=>$reservation,
        ],201);
    }

    // confirmer paiement — reveler numero whatsapp
    public function confirmerPaiement($id){
        $reservation = Reservation::with('creneau.enseignant.user')->where('id_reservation',$id)->where('id_utilisateur', Auth::id())->first();

        if (!$reservation){
            return response()->json([
                'message'=>'Réservation introuvable !'
            ],404);

            //confirmer la reservation
            $reservation->update(['statut'=>'confirmee']);

            //confirmer le paiment
            Paiment::w
        }


    }
}

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
    //liste des reservations de l'etudiant connectee
    public function index(){
        $reservations = Reservation::with('creneau.enseignant.user','paiement')->where('id_utilisateur',Auth::id())->get();
        return response()->json($reservations);
    }

    // reservations de l'enseignant
    public function mesReservationsEnseignant(){
        $creneaux = Creneau::with('reservations.etudiant','reservations.paiement')->where('id_enseignant',Auth::id())->get();
        return response()->json($creneaux);
    }

    //creer une reservation
    public function store(Request $request){
        $request->validate([
            'id_creneau'=>'required|exists:creneaux,id_creneau',
            'date'=>'required|date|after:today',
            'id_offre'=>'nullable|exists:offres,id_offre',
            'methode'=>'required|in:simulation,cash', 
        ]);

        //recuperer le creneau dispo
        $creneau = Creneau::where('id_creneau',$request->id_creneau)->where('estDisponible',true)->first();

        if(!$creneau){
            return response()->json([
                'message'=>'Créneau non disponible !'
            ],400);
        }

        // ne peut pas reserver son propre cours
        if($creneau->id_enseignant == Auth::id()){
            return response()->json([
                'message'=>'Vous ne pouvez pas réserver votre propre cours !'
            ],403);
        }

        //verifier si la 1er reservation de user
        $dejaReserve = Reservation::where('id_utilisateur',Auth::id())->first();

        if(!$dejaReserve){
            $montant = 0;//1er cours gratuit
        }
        elseif($request->id_offre){
            $offre = Offre::find($request->id_offre);//recuperer l'offre
            $montant = $offre ? $offre->prix : $creneau->enseignant->tarifHeure;//calcule de montant
        }
        else{
            $montant = $creneau->enseignant->tarifHeure;//user n'a choisit acune offre donc le prix de l'enseignant
        }

        // creation de la reservation
        $reservation = Reservation::create([
            'date'=>$request->date,
            'montant'=>$montant,
            'statut'=>'en_attente',
            'id_utilisateur'=>Auth::id(),
            'id_creneau'=>$request->id_creneau,
            'id_offre'=>$request->id_offre,
        ]);

        //creneau indispo apres reservation
        $creneau->update(['estDisponible'=>false]);

        //calcul de comision 10%
        $comission = $montant * 0.10;

        //creer un paiment
        Paiement::create([
            'montantTotal'=>$montant,
            'comission'=>$comission,
            'montantEnseignant'=>$montant-$comission,
            'methode'=>$request->methode, // simulation paypal ou cash
            'statut'=>'en_attente',
            'id_reservation'=>$reservation->id_reservation,
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

        //confirmer le paiement
        Paiement::where('id_reservation',$id)->update(['statut'=>'paye']);

        //recuperer le num de l'enseignant
        $telephone = $reservation->creneau->enseignant->user->telephone;

        // recuperer la methode de paiement
        $paiement = Paiement::where('id_reservation',$id)->first();

        // message selon methode
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

    //annuler reservation
    public function destroy($id){
        $reservation = Reservation::where('id_reservation',$id)->where('id_utilisateur',Auth::id())->first();

        if(!$reservation){
            return response()->json([
                'message'=>'Réservation introuvable !'
            ],404);
        }

        //liberer creneau
        Creneau::where('id_creneau',$reservation->id_creneau)->update(['estDisponible'=>true]);

        //annuler reservation
        $reservation->update(['statut'=>'annulee']);

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

        return response()->json([
            'message'=>'Cours terminé ! Vous pouvez maintenant laisser un avis.',
            'reservation'=>$reservation,
        ]);
    }
}
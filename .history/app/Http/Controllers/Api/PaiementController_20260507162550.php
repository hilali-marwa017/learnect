<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Paiement;
use App\Models\Reservation;
use Illuminate\Support\Facades\Auth;

class PaiementController extends Controller
{
    // recuperer la liste des paiements d'un user connectee
    public function index(){
        $paiements = Paiement::with('reservation.creneau.enseignant.user')->get()->where('reservation.id_utilisateur',Auth::id());
        return response()->json($paiements);
    }

    public function show($id){
        $paiement = Paiement::with('reservation')->find($id);
        if (!$paiement) {
            return response()->json([
                'message'=>'Paiement introuvable !'
            ],404);
        }

        return response()->json($paiement);
    }

    // calculer le revenu d'enseignant connectee
    public function revenusEnseignant(){
        $enseignant = auth()->user()->enseignant;//recuperer l'enseignant liee au user connectee

        $creneaux = $enseignant->creneaux()->with('reservations.paiement')->get();

        $total = 0;// total des revenus
        $paiements =[];// liste des paiements 

        foreach ($creneaux as $creneau){// tous les cours de l'enseignant
            foreach ($creneau->reservations as $reservation){//
                if ($reservation->paiement && $reservation->paiement->statut === 'paye'){ 
                    $total = $total + $reservation->paiement->montantEnseignant; // ajouter le montant au total //table enseignant
                    $paiements[] = $reservation->paiement;
                }
            }
        }

        return response()->json([
            'paiements'=>$paiements,
            'total_revenu'=>$total,
        ]);
    }

    public function adminIndex(){
        $paiements = Paiement::with('reservation.etudiant')->orderBy('created_at','desc')->get();

        return response()->json([
            'paiements'=>$paiements,
            'stats'=>[
                'total_revenus'=>Paiement::where('statut','paye')->sum('comission'),
                'total_paiements'=>Paiement::where('statut','paye')->count(),
            ],
        ]);
    }
}
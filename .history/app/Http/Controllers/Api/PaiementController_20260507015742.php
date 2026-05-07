<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Paiement;
use Illuminate\Support\Facades\Auth;

class PaiementController extends Controller
{
    public function index(){
        $paiements=Paiement::with('reservation.creneau.enseignant.user')->get()->where('reservation.id_utilisateur',Auth::id())->values();
        return response()->json($paiements);
    }

    public function show(Paiement $paiement)
    {
        return response()->json($paiement->load('reservation'));
    }

    public function revenusEnseignant()
    {
        $enseignant=auth()->user()->enseignant;
        $creneaux=$enseignant->creneaux()->with('reservations.paiement')->get();
        $total=0;
        $paiements=[];
        foreach($creneaux as $creneau){
            foreach($creneau->reservations as $reservation){
                if($reservation->paiement && $reservation->paiement->statut==='paye'){
                    $total+=$reservation->paiement->montantEnseignant;
                    $paiements[]=$reservation->paiement;
                }
            }
        }
        return response()->json([
            'paiements'=>$paiements,
            'total_revenu'=>$total
        ]);
    }

    public function adminIndex()
    {
        $paiements=Paiement::with('reservation.etudiant')->orderBy('created_at','desc')->get();
        return response()->json([
            'paiements'=>$paiements,
            'stats'=>[
                'total_revenus'=>Paiement::where('statut','paye')->sum('comission'),
                'total_paiements'=>Paiement::where('statut','paye')->count()
            ]
        ]);
    }
}
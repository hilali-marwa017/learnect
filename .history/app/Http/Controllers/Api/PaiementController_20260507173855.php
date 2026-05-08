<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Paiement;
use Illuminate\Support\Facades\Auth;

class PaiementController extends Controller
{
    // Liste des paiements de l'utilisateur connecté
    public function index()
    {
        $paiements = Paiement::with('reservation.creneau.enseignant.user')
            ->join('reservations', 'paiements.id_reservation', '=', 'reservations.id_reservation')
            ->where('reservations.id_utilisateur', Auth::id())
            ->select('paiements.*')
            ->get();

        return response()->json($paiements);
    }

    // Afficher un paiement spécifique
    public function show($id)
    {
        $paiement = Paiement::with('reservation')->find($id);

        if (!$paiement) {
            return response()->json([
                'message' => 'Paiement introuvable !'
            ], 404);
        }

        return response()->json($paiement);
    }

    // Revenus de l'enseignant connecté
    public function revenusEnseignant()
    {
        $paiements = Paiement::join('reservations', 'paiements.id_reservation', '=', 'reservations.id_reservation')
            ->join('creneaux', 'reservations.id_creneau', '=', 'creneaux.id_creneau')
            ->where('creneaux.id_enseignant', Auth::id())
            ->where('paiements.statut', 'paye')
            ->select('paiements.*')
            ->get();

        $total = $paiements->sum('montantEnseignant');

        return response()->json([
            'paiements' => $paiements,
            'total_revenu' => $total,
        ]);
    }

    // admin : liste des paiements + stats
    public function adminIndex(){
        $paiements = Paiement::with('reservation.etudiant')->orderBy('created_at', 'desc')->get();

        return response()->json([
            'paiements' => $paiements,
            'stats' => [
                'total_revenus' => Paiement::where('statut', 'paye')->sum('comission'),
                'total_paiements' => Paiement::where('statut', 'paye')->count(),
            ],
        ]);
    }
}
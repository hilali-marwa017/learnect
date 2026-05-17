<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Signalement;
use App\Models\Avis;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SignalementController extends Controller
{
    // Signaler un avis
    public function store(Request $request)
    {
        $request->validate([
            'motif'   => 'required|string|min:10',
            'id_avis' => 'required|exists:avis,id_avis',
        ]);

        // Verifier que l'avis existe
        $avis = Avis::find($request->id_avis);

        if (!$avis) {
            return response()->json([
                'message' => 'Avis introuvable !'
            ], 404);
        }

        // Verifier que l'utilisateur n'a pas deja signale cet avis
        $signalementExistant = Signalement::where('id_avis', $request->id_avis)
                                          ->where('id_signaleur', Auth::id())
                                          ->first();

        if ($signalementExistant) {
            return response()->json([
                'message' => 'Vous avez déjà signalé cet avis !'
            ], 400);
        }

        $signalement = Signalement::create([
            'motif'        => $request->motif,
            'statut'       => 'en_attente',
            'id_avis'      => $request->id_avis,
            'id_signaleur' => Auth::id(),
        ]);

        return response()->json([
            'message'      => 'Signalement envoyé avec succès !',
            'signalement'  => $signalement,
        ], 201);
    }

    // Liste signalements — admin
    public function index()
    {
        $signalements = Signalement::with('avis.etudiant', 'signaleur')
                                   ->where('statut', 'en_attente')
                                   ->get();

        return response()->json($signalements);
    }

    // Traiter un signalement — admin
    public function traiter($id)
    {
        $signalement = Signalement::find($id);

        if (!$signalement) {
            return response()->json([
                'message' => 'Signalement introuvable !'
            ], 404);
        }

        $signalement->update(['statut' => 'traite']);

        return response()->json([
            'message' => 'Signalement traité avec succès !'
        ]);
    }
}
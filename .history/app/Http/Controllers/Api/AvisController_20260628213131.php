<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Avis;
use App\Models\Reservation;
use App\Models\Enseignant;
use Illuminate\Support\Facades\Auth;

class AvisController extends Controller
{
    // liste des avis d'un enseignant (route publique)
    public function getByEnseignant($id){
        $enseignant = Enseignant::where('utilisateur_id', $id)->first();
        if (!$enseignant) {
            return response()->json(['message' => 'Enseignant introuvable !'], 404);
        }
        $avis = Avis::with('etudiant')
                    ->where('id_enseignant', $id)
                    ->orderBy('created_at', 'desc')
                    ->get();
        return response()->json($avis);
    }

    // liste des avis d'un enseignant (pour l'admin)
    public function index($id_enseignant){
        $enseignant = Enseignant::where('utilisateur_id', $id_enseignant)->first();

        if (!$enseignant) {
            return response()->json(['message' => 'Enseignant introuvable !'], 404);
        }

        $avis = Avis::with('etudiant')
                    ->where('id_enseignant', $id_enseignant)
                    ->orderBy('created_at', 'desc')
                    ->get();

        return response()->json($avis);
    }

    public function peutNoter($id_enseignant){
        $reservation = Reservation::whereHas('creneau', function($q) use ($id_enseignant) {
                $q->where('id_enseignant', $id_enseignant);
            })
            ->where('id_utilisateur', Auth::id())
            ->where('statut', 'terminee')
            ->whereDoesntHave('avis')
            ->orderBy('created_at', 'desc')
            ->first();

        return response()->json([
            'peut_noter' => !!$reservation,
            'id_reservation' => $reservation?->id_reservation,
        ]);
    }

    public function store(Request $request){
        $request->validate([
            'note' => 'required|integer|min:1|max:5',
            'commentaire' => 'required|string|min:10',
            'id_enseignant' => 'required|exists:enseignants,utilisateur_id',
            'id_reservation' => 'required|exists:reservations,id_reservation'
        ]);

        $reservation = Reservation::where('id_reservation', $request->id_reservation)
                                  ->where('id_utilisateur', Auth::id())
                                  ->where('statut', 'terminee')
                                  ->first();

        if (!$reservation) {
            return response()->json([
                'message' => 'Vous ne pouvez pas laisser un avis avant la fin du cours !'
            ], 400);
        }

        if ($reservation->avis()->exists()) {
            return response()->json([
                'message' => 'Vous avez deja note ce cours !'
            ], 400);
        }

        $avis = Avis::create([
            'note' => $request->note,
            'commentaire' => $request->commentaire,
            'id_utilisateur' => Auth::id(),
            'id_enseignant' => $request->id_enseignant,
            'id_reservation' => $request->id_reservation
        ]);

        $noteMoyenne = Avis::where('id_enseignant', $request->id_enseignant)->avg('note');
        Enseignant::where('utilisateur_id', $request->id_enseignant)
                  ->update(['noteMoyenne' => round($noteMoyenne, 2)]);

        return response()->json([
            'message' => 'Avis laisse avec succes !',
            'avis' => $avis,
        ], 201);
    }

    public function destroy($id){
        $avis = Avis::where('id_avis', $id)
                    ->where('id_utilisateur', Auth::id())
                    ->first();

        if (!$avis) {
            return response()->json(['message' => 'Avis introuvable !'], 404);
        }

        $id_enseignant = $avis->id_enseignant;
        $avis->delete();

        $noteMoyenne = Avis::where('id_enseignant', $id_enseignant)->avg('note') ?? 0;
        Enseignant::where('utilisateur_id', $id_enseignant)
                  ->update(['noteMoyenne' => $noteMoyenne]);

        return response()->json(['message' => 'Avis supprime avec succes !']);
    }
}
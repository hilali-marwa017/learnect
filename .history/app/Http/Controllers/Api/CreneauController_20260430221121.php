<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Creneau;
use App\Models\Enseignant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CreneauController extends Controller
{
    // Liste des creneaux d'un enseignant
    public function index($id){
        // Verifier que l'enseignant existe
        $enseignant = Enseignant::find($id);
        if (!$enseignant){
            return response()->json([
                'message'=>'Enseignant introuvable !'
            ], 404);
        }
        $creneaux = Creneau::where('id_enseignant', $id)->get();
        return response()->json($creneaux);
    }

    // Creer un creneau
    public function store(Request $request){
        $request->validate([
            'jour'=>'required|in:lundi,mardi,mercredi,jeudi,vendredi,samedi,dimanche',
            'heureDebut'=>'required|date_format:H:i',
            'heureFin'=>'required|date_format:H:i|after:heureDebut',
        ]);

        $creneau = Creneau::create([
            'jour'=> $request->jour,
            'heureDebut'=> $request->heureDebut,
            'heureFin'=> $request->heureFin,
            'estDisponible'=> true,
            'id_enseignant'=> Auth::id(),
        ]);

        return response()->json([
            'message'=>'Créneau créé avec succès !',
            'creneau'=>$creneau,
        ], 201);
    }

    // Modifier un creneau
    public function update(Request $request, $id){
        $request->validate([
            'jour'=>'in:lundi,mardi,mercredi,jeudi,vendredi,samedi,dimanche',
            'heureDebut'=>'date_format:H:i',
            'heureFin'=>'date_format:H:i',
        ]);

        $creneau = Creneau::where('id_creneau', $id)
                        ->where('id_enseignant', Auth::id())
                          ->first();

        if (!$creneau) {
            return response()->json([
                'message' => 'Créneau introuvable !'
            ], 404);
        }

        $creneau->update($request->only([
            'jour',
            'heureDebut',
            'heureFin',
            'estDisponible',
        ]));

        return response()->json([
            'message' => 'Créneau modifié avec succès !',
            'creneau' => $creneau,
        ]);
    }

    // Supprimer un creneau
    public function destroy($id)
    {
        $creneau = Creneau::where('id_creneau', $id)
                          ->where('id_enseignant', Auth::id())
                          ->first();

        if (!$creneau) {
            return response()->json([
                'message' => 'Créneau introuvable !'
            ], 404);
        }

        $creneau->delete();

        return response()->json([
            'message' => 'Créneau supprimé avec succès !'
        ]);
    }
}
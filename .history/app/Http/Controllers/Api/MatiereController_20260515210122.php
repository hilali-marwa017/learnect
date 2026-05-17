<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Matiere;
use App\Models\Enseignant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class MatiereController extends Controller
{
    // Liste toutes les matieres
    public function index()
    {
        $matieres = Matiere::all();
        return response()->json($matieres);
    }

    // Matieres par categorie
    public function parCategorie($categorie)
    {
        $matieres = Matiere::where('categorie', $categorie)->get();
        return response()->json($matieres);
    }

    // Ajouter matiere a un enseignant
    public function ajouterMatiere(Request $request)
    {
        $request->validate([
            'id_matiere' => 'required|exists:matieres,id_matiere',
            'niveau'     => 'required|string',
        ]);

        $enseignant = Enseignant::where('utilisateur_id', Auth::id())->first();

        if (!$enseignant) {
            return response()->json([
                'message' => 'Enseignant introuvable !'
            ], 404);
        }

        // Verifier que l'enseignant n'a pas deja cette matiere
        $matiereExistante = $enseignant->matieres()
                                       ->where('id_matiere', $request->id_matiere)
                                       ->first();

        if ($matiereExistante) {
            return response()->json([
                'message' => 'Vous enseignez déjà cette matière !'
            ], 400);
        }

        // Attacher la matiere
        $enseignant->matieres()->attach($request->id_matiere, [
            'niveau' => $request->niveau,
        ]);

        return response()->json([
            'message'  => 'Matière ajoutée avec succès !',
            'matieres' => $enseignant->matieres,
        ]);
    }

    // Supprimer matiere d'un enseignant
    public function supprimerMatiere($id_matiere)
    {
        $enseignant = Enseignant::where('utilisateur_id', Auth::id())->first();

        if (!$enseignant) {
            return response()->json([
                'message' => 'Enseignant introuvable !'
            ], 404);
        }

        // Detacher la matiere
        $enseignant->matieres()->detach($id_matiere);

        return response()->json([
            'message' => 'Matière supprimée avec succès !'
        ]);
    }

    // Admin — creer une matiere
    public function store(Request $request)
    {
        $request->validate([
            'nom'       => 'required|string|unique:matieres,nom',
            'categorie' => 'required|string',
        ]);

        $matiere = Matiere::create([
            'nom'       => $request->nom,
            'categorie' => $request->categorie,
        ]);

        return response()->json([
            'message' => 'Matière créée avec succès !',
            'matiere' => $matiere,
        ], 201);
    }

    // Admin — supprimer une matiere
    public function destroy($id)
    {
        $matiere = Matiere::find($id);

        if (!$matiere) {
            return response()->json([
                'message' => 'Matière introuvable !'
            ], 404);
        }

        $matiere->delete();

        return response()->json([
            'message' => 'Matière supprimée avec succès !'
        ]);
    }
}
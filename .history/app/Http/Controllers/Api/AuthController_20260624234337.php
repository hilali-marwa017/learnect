<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Enseignant;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class TeacherProfileController extends Controller
{
    public function show()
    {
        $user = Auth::user();
        $teacher = Enseignant::where('utilisateur_id', $user->utilisateur_id)->first();
        
        return response()->json([
            'user' => $user,
            'teacher' => $teacher
        ]);
    }

    public function update(Request $request)
    {
        $user = Auth::user();
        
        // ✅ Validation sans la photo obligatoire
        $rules = [
            'nom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'telephone' => 'required|string|max:20|unique:users,telephone,' . $user->utilisateur_id . ',utilisateur_id',
            'ville' => 'required|string|max:255',
            'titre' => 'nullable|string|max:255',
            'tarifHeure' => 'nullable|numeric|min:0',
            'description_profil' => 'nullable|string',
            'description_cours' => 'nullable|string',
            'langues' => 'nullable|string|max:255',
            'cours_domicile' => 'nullable|boolean',
            'cours_enligne' => 'nullable|boolean',
            'cours_deplacement' => 'nullable|boolean',
            'statut_annonce' => 'nullable|in:brouillon,en_ligne,suspendue',
        ];

        // ✅ Valider la photo SEULEMENT si elle est présente
        if ($request->hasFile('photo')) {
            $rules['photo'] = 'image|mimes:jpg,jpeg,png|max:2048';
        }

        $request->validate($rules);

        // Mettre à jour l'utilisateur
        $user->nom = $request->nom;
        $user->prenom = $request->prenom;
        $user->telephone = $request->telephone;
        $user->ville = $request->ville;
        
        // ✅ Gérer la photo seulement si elle est présente
        if ($request->hasFile('photo')) {
            // Supprimer l'ancienne photo si elle existe
            if ($user->photo) {
                Storage::disk('public')->delete($user->photo);
            }
            
            // Sauvegarder la nouvelle photo
            $path = $request->file('photo')->store('photos/enseignants', 'public');
            $user->photo = $path;
        }
        
        $user->save();

        // Mettre à jour l'enseignant
        $teacher = Enseignant::where('utilisateur_id', $user->utilisateur_id)->first();
        
        if ($teacher) {
            $teacher->titre = $request->titre;
            $teacher->tarifHeure = $request->tarifHeure;
            $teacher->description_profil = $request->description_profil;
            $teacher->description_cours = $request->description_cours;
            $teacher->langues = $request->langues;
            $teacher->cours_domicile = $request->cours_domicile ?? $teacher->cours_domicile;
            $teacher->cours_enligne = $request->cours_enligne ?? $teacher->cours_enligne;
            $teacher->cours_deplacement = $request->cours_deplacement ?? $teacher->cours_deplacement;
            
            if ($request->has('statut_annonce')) {
                $teacher->statut_annonce = $request->statut_annonce;
            }
            
            $teacher->save();
        }

        return response()->json([
            'message' => 'Profil mis à jour avec succès !',
            'user' => $user,
            'teacher' => $teacher
        ]);
    }

    // Méthode pour mettre à jour seulement la photo
    public function updatePhoto(Request $request)
    {
        $request->validate([
            'photo' => 'required|image|mimes:jpg,jpeg,png|max:2048'
        ]);

        $user = Auth::user();

        // Supprimer l'ancienne photo
        if ($user->photo) {
            Storage::disk('public')->delete($user->photo);
        }

        // Sauvegarder la nouvelle photo
        $path = $request->file('photo')->store('photos/enseignants', 'public');
        $user->photo = $path;
        $user->save();

        return response()->json([
            'message' => 'Photo mise à jour avec succès !',
            'photo' => $path
        ]);
    }

    // Méthode pour supprimer la photo
    public function deletePhoto()
    {
        $user = Auth::user();

        if ($user->photo) {
            Storage::disk('public')->delete($user->photo);
            $user->photo = null;
            $user->save();
        }

        return response()->json([
            'message' => 'Photo supprimée avec succès !'
        ]);
    }
}
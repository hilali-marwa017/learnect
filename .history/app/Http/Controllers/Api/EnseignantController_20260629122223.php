<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Enseignant;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class EnseignantController extends Controller
{
    public function index(Request $request){
        $query = Enseignant::with('user', 'matieres');
        $query->where('estVerifie', true)->where('statut_annonce', 'en_ligne');

        $query->whereHas('user', function($q){
            $q->where('statut', 'actif');
        });

        if ($request->filled('ville')){
            $query->whereHas('user', function($q) use ($request){
                $q->where('ville', 'like', '%' . $request->ville . '%');
            });
        }

        if ($request->filled('tarif_max')){
            $query->where('tarifHeure', '<=', $request->tarif_max);
        }

        if ($request->filled('cours_enligne')){
            $query->where('cours_enligne', true);
        }

        if ($request->filled('cours_domicile')){
            $query->where('cours_domicile', true);
        }

        if ($request->filled('note_min')){
            $query->where('noteMoyenne', '>=', $request->note_min);
        }

        $enseignants = $query->get();
        return response()->json($enseignants);
    }

    public function show($id){
        $enseignant = Enseignant::with(['user', 'matieres', 'avis.etudiant', 'creneaux'])
            ->where('utilisateur_id', $id)
            ->first();

        if (!$enseignant){
            return response()->json([
                'message' => 'Enseignant introuvable !'
            ], 404);
        }

        return response()->json($enseignant);
    }

    public function completeProfile(Request $request){
        $request->validate([
            'titre' => 'required|string|min:3',
            'description_cours' => 'required|string|min:10',
            'description_profil' => 'required|string|min:10',
            'tarifHeure' => 'required|numeric|min:5',
            'langues' => 'required|string'
        ]);

        $enseignant = Enseignant::where('utilisateur_id', Auth::id())->first();

        if (!$enseignant) {
            return response()->json([
                'message' => 'Profil enseignant introuvable pour cet utilisateur.'
            ], 404);
        }

        $enseignant->update([
            'titre' => $request->titre,
            'description_cours' => $request->description_cours,
            'description_profil' => $request->description_profil,
            'cours_domicile' => $request->cours_domicile ?? false,
            'cours_deplacement' => $request->cours_deplacement ?? false,
            'cours_enligne' => $request->cours_enligne ?? false,
            'distance_max' => $request->distance_max,
            'langues' => $request->langues,
            'tarifHeure' => $request->tarifHeure,
            'statut_annonce' => 'en_ligne'
        ]);

        return response()->json([
            'message' => 'Profil complete avec succes !',
            'enseignant' => $enseignant
        ]);
    }

    public function update(Request $request){
        $enseignant = Enseignant::where('utilisateur_id', Auth::id())->first();

        if (!$enseignant) {
            return response()->json([
                'message' => 'Profil enseignant introuvable pour cet utilisateur.'
            ], 404);
        }

        $request->validate([
            'titre' => 'sometimes|string|min:3',
            'description_cours' => 'sometimes|string|min:10',
            'description_profil' => 'sometimes|string|min:10',
            'tarifHeure' => 'sometimes|numeric|min:5',
            'langues' => 'sometimes|string|nullable',
            'cours_domicile' => 'sometimes|boolean',
            'cours_deplacement' => 'sometimes|boolean',
            'cours_enligne' => 'sometimes|boolean',
            'nom' => 'sometimes|string|min:2',
            'prenom' => 'sometimes|string|min:2',
            'telephone' => 'sometimes|string',
            'ville' => 'sometimes|string',
        ]);

        $enseignant->update($request->only([
            'titre',
            'description_cours',
            'description_profil',
            'cours_domicile',
            'cours_deplacement',
            'cours_enligne',
            'distance_max',
            'langues',
            'tarifHeure',
        ]));

        $user = User::find(Auth::id());

        if (!$user) {
            return response()->json([
                'message' => 'Utilisateur introuvable.'
            ], 404);
        }

        if ($request->filled('nom')) $user->nom = $request->nom;
        if ($request->filled('prenom')) $user->prenom = $request->prenom;
        if ($request->filled('telephone')) $user->telephone = $request->telephone;
        if ($request->filled('ville')) $user->ville = $request->ville;
        $user->save();

        $enseignant->setRelation('user', $user);

        return response()->json([
            'message' => 'Profil modifie avec succes !',
            'enseignant' => $enseignant,
            'user' => $user
        ]);
    }

    public function uploadPhoto(Request $request){
        $request->validate([
            'photo' => 'required|image|mimes:jpg,jpeg,png'
        ]);

        $user = User::find(Auth::id());

        if (!$user) {
            return response()->json([
                'message' => 'Utilisateur introuvable.'
            ], 404);
        }

        if ($user->photo){
            Storage::disk('public')->delete($user->photo);
        }

        $file = $request->file('photo');
        $filename = 'photo_' . Auth::id() . '_' . time() . '.' . $file->getClientOriginalExtension();
        $user->photo = $file->storeAs('photos/profil', $filename, 'public');
        $user->save();

        return response()->json([
            'message' => 'Photo uploadée avec succes !',
            'photo' => $user->photo,
            'user' => $user
        ]);
    }

    public function uploadDocuments(Request $request){
        $request->validate([
            'cin_recto' => 'required|image|mimes:jpg,jpeg,png',
            'cin_verso' => 'required|image|mimes:jpg,jpeg,png',
            'diplome' => 'required|mimes:pdf|max:5120' 
        ]);

        $enseignant = Enseignant::where('utilisateur_id', Auth::id())->first();

        if (!$enseignant) {
            return response()->json([
                'message' => 'Profil enseignant introuvable pour cet utilisateur.'
            ], 404);
        }

        $fileRecto = $request->file('cin_recto');
        $nameRecto = 'cin_recto_' . Auth::id() . '_' . time() . '.' . $fileRecto->getClientOriginalExtension();
        $enseignant->cin_recto = $fileRecto->storeAs('documents/cin', $nameRecto, 'public');

        $fileVerso = $request->file('cin_verso');
        $nameVerso = 'cin_verso_' . Auth::id() . '_' . time() . '.' . $fileVerso->getClientOriginalExtension();
        $enseignant->cin_verso = $fileVerso->storeAs('documents/cin', $nameVerso, 'public');

        $fileDiplome = $request->file('diplome');
        $nameDiplome = 'diplome_' . Auth::id() . '_' . time() . '.' . $fileDiplome->getClientOriginalExtension();
        $enseignant->diplome = $fileDiplome->storeAs('documents/diplome', $nameDiplome, 'public');

        $enseignant->save();

        return response()->json([
            'message' => 'Documents uploades avec succes !',
            'enseignant' => $enseignant
        ]);
    }

    public function dashboard(){
        $enseignant = Enseignant::with('creneaux', 'offres', 'avis')
            ->where('utilisateur_id', Auth::id())
            ->first();

        if (!$enseignant) {
            return response()->json([
                'message' => 'Enseignant non trouve'
            ], 404);
        }

        $stats = [
            'total_avis' => $enseignant->avis->count(),
            'note_moyenne' => $enseignant->noteMoyenne,
            'creneaux_dispos' => $enseignant->creneaux->where('estDisponible', true)->count(),
            'offres_en_attente' => $enseignant->offres->where('statut', 'en_attente')->count(),
        ];

        return response()->json([
            'enseignant' => $enseignant,
            'stats' => $stats
        ]);
    }
}
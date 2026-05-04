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
    // Liste des enseignants 
    public function index(Request $request){
        $query = Enseignant::query();
        $query->with('user','matieres');
        $query->where('estVerifie',true)->where('statut_annonce','en_ligne');

        if ($request->filled('ville')){
            $query->join('users','enseignants.utilisateur_id','=','users.utilisateur_id')->where('users.ville', 'like', '%' . $request->ville . '%')->select('enseignants.*');// juste la colonne enseignants 
        }

        if ($request->filled('tarif_max')){
            $query->where('tarifHeure','<=',$request->tarif_max);
        }

        if ($request->filled('cours_enligne')){
            $query->where('cours_enligne', true);
        }

        if ($request->filled('cours_domicile')){
            $query->where('cours_domicile',true);
        }

        if ($request->filled('note_min')){
            $query->where('noteMoyenne', '>=',$request->note_min);
        }

        $enseignants = $query->get(); // Retourne la liste des enseignants
        return response()->json($enseignants);
    }

    // Profil enseignant
    public function show($id){
        $enseignant = Enseignant::with('user', 'matieres', 'avis', 'creneaux')->where('utilisateur_id',$id)->first();

        if (!$enseignant){
            return response()->json([
                'message'=>'Enseignant introuvable !'
            ],404);
        }

        return response()->json($enseignant);
    }

    // Completer profil enseignant
    public function completeProfile(Request $request){
        $request->validate([
            'titre'=>'required|string|min:10',
            'description_cours'=>'required|string|min:30',
            'description_profil'=>'required|string|min:30',
            'tarifHeure'=>'required|numeric|min:5',
            'langues'=>'required|string',
        ]);

        $enseignant = Enseignant::where('utilisateur_id',Auth::id())->first();

        $enseignant->update([
            'titre'=>$request->titre,
            'description_cours'=>$request->description_cours,
            'description_profil'=>$request->description_profil,
            'cours_domicile'=>$request->cours_domicile ?? false,
            'cours_deplacement'=>$request->cours_deplacement ?? false,
            'cours_enligne'=>$request->cours_enligne ?? false,
            'distance_max'=>$request->distance_max,
            'langues'=>$request->langues,
            'tarifHeure'=>$request->tarifHeure,
            'statut_annonce'=>'en_ligne',
        ]);

        return response()->json([
            'message'=>'Profil complété avec succès !',
            'enseignant'=>$enseignant,
        ]);
    }

    // Modifier profil enseignant
    public function update(Request $request){
        $request->validate([
            'titre'=>'string|min:10',
            'description_cours'=>'string|min:30',
            'description_profil'=>'string|min:30',
            'tarifHeure'=>'numeric|min:5',
            'langues'=>'string',
        ]);

        $enseignant = Enseignant::where('utilisateur_id',Auth::id())->first();

        $enseignant->update($request->only(['titre', 'description_cours', 'description_profil','cours_domicile', 'cours_deplacement', 'cours_enligne','distance_max', 'langues', 'tarifHeure']));

        return response()->json([
            'message'=>'Profil modifié avec succès !',
            'enseignant'=>$enseignant,
        ]);
    }

    // Upload photo profil
    public function uploadPhoto(Request $request){
        $request->validate([
            'photo'=>'required|image|mimes:jpg,jpeg,png|max:2048'
        ]);

        $user = User::find(Auth::id());

        if ($user->photo){
            Storage::disk('public')->delete($user->photo);
        }

        $file = $request->file('photo');
        $filename ='photo_' . Auth::id() . '_' . time() . '.' . $file->getClientOriginalExtension();
        $user->photo = $file->storeAs('photos/profil', $filename, 'public');//
        $user->save();

        return response()->json([
            'message'=>'Photo uploadée avec succès !',
            'photo'=>$user->photo,
        ]);
    }

    // Upload CIN + Diplome
    public function uploadDocuments(Request $request){
        $request->validate([
            'cin_recto'=>'required|image|mimes:jpg,jpeg,png|max:2048',
            'cin_verso'=>'required|image|mimes:jpg,jpeg,png|max:2048',
            'diplome'=>'required|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        $enseignant = Enseignant::where('utilisateur_id', Auth::id())->first();

        $fileRecto = $request->file('cin_recto');
        $nameRecto ='cin_recto_' . Auth::id() . '_' . time() . '.' . $fileRecto->getClientOriginalExtension();
        $enseignant->cin_recto = $fileRecto->storeAs('documents/cin', $nameRecto, 'public');

        $fileVerso = $request->file('cin_verso');
        $nameVerso= 'cin_verso_' . Auth::id() . '_' . time() . '.' . $fileVerso->getClientOriginalExtension();
        $enseignant->cin_verso = $fileVerso->storeAs('documents/cin', $nameVerso, 'public');

        $fileDiplome = $request->file('diplome');
        $nameDiplome = 'diplome_' . Auth::id() . '_' . time() . '.' . $fileDiplome->getClientOriginalExtension();
        $enseignant->diplome  = $fileDiplome->storeAs('documents/diplome', $nameDiplome, 'public');

        $enseignant->save();

        return response()->json([
            'message'=>'Documents uploadés avec succès !',
            'enseignant'=>$enseignant,
        ]);
    }

    // Dashboard enseignant
    public function dashboard(){
        $enseignant = Enseignant::with('creneaux', 'offres', 'avis')->where('utilisateur_id', Auth::id())->first();

        if (!$enseignant) {
            return response()->json([
                'message'=>'Enseignant non trouvé'
            ], 404);
        }

        $stats = [
            'total_avis'=>$enseignant->avis->count(),
            'note_moyenne'=>$enseignant->noteMoyenne,
            'creneaux_dispos'=>$enseignant->creneaux->where('estDisponible', true)->count(),
            'offres_en_attente'=>$enseignant->offres->where('statut', 'en_attente')->count(),
        ];

        return response()->json([
            'enseignant'=>$enseignant,
            'stats'=>$stats,
        ]);
    }
}
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Enseignant; //pour acceder a la table enseignant
use App\Models\User;//pour acceder a la table users
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;

class EnseignantController extends Controller
{
    //liste des enseignants
    public function index(Request $request){
        // query demarre une requete sur la table enseignants
        $query = Enseignant::query();
        $query->with('user','matieres');
        $query->where('estVerifie','true')->where('statut_annonce','en_ligne');

        if($request->filled('tarif_max')){
            $query->where('tarifHeure','<=', $request->tarif_max);
        }

        if($request->filled('cours_enligne')){
            $query->where('cours_enligne','true');
        }
        if($request->filled('cours_domicile')){
            $query->where('cours_domicile','true');
        }
        if($request->filled('note_min')){
            $query->where('noteMoyenne' ,'>=',$request->note_min);
        }
        $enseignants = $query->get();
        return response()->json($enseignants); //recuperation des donnees depuis la db et la renvoie sous forme de json
    }
    //profil enseignant
    public function show($id){
        $enseignant = Enseignant::with('user','matieres','avis','creneaux')->where('utilisateur_id',$id)->first();

        if(!$enseignant){
            return response()->json([
                'message'=>'Enseignant introuvable !'
            ],404);
        }

        return response()->json($enseignant);
    }

    // completer profil enseignant
    public function completeProfile(Request $request){
        //validation
        $request->validate([
            'titre'=>'required|string|min:10',
            'description_cours'=>'required|string|min:30',
            'description_profil'=>'required|string|min:30',
            'tarifHeure'=>'required|numeric|min:5',
            'langues'=>'required|string'
        ]);
        //auth:id() c'est une fonction laravel qui recupere l'id de l'utilisateur actuellement connectee!
        $enseignant = Enseignant::where('utilisateur_id',Auth::id())->first();
        $enseignant->update([
            'titre'=>$request->titre,
            'description_cours'=>$request->description_cours,
            'description_profil'=> $request->description_profil,
            'cours_domicile'=> $request->cours_domicile ?? false,
            'cours_deplacement'=> $request->cours_deplacement ?? false,
            'cours_enligne'=> $request->cours_enligne ?? false,
            'distance_max'=> $request->distance_max,
            'langues'=> $request->langues,
            'tarifHeure'=> $request->tarifHeure,
            'statut_annonce'=> 'en_ligne',
        ]);

        return responce()->json([
            'message'=>'Profil complété avec succès !',
            'enseignant' => $enseignant,
        ]);
    }

    //modifier profil enseignant
    public function update(Request $request){
        $request->validate([
            'titre'=>'string|min:10',
            'description_cours'=>'string|min:30',
            'description_profil'=>'string|min:30',
            'tarifHeure'=>'required|numeric|min:5',
            'langues'=>'string'
        ]);

        return response()->json([
            'message'=>'Profil modifié avec succès !',
            'enseignant' => $enseignant,
        ]);
    }
    // upload photo profil
    public function uplpoadPhoto(Request $request){
        $request->validate([
            'photo'=>'nullable|image|mimes:jpg,jpeg,png|max:2048'
        ]);

        $user = User::find(Auth::id());
        if ($user->photo) {
            Storage::disk('public')->delete($user->photo);
        }
        //recupartion d'image
        $file = $request->file('photo');
        $filename = 'photo_' . Auth::id() . '_' . time() . '.' . $file->getClientOriginalExtension();//recupere l'extentsion d'image jpg png jpeg  || photo_5_1700000000.jpg
        $user->photo = $file->storeAs('photos/profil', $filename, 'public');
        $user->save();

        return response()->json([
            'message'=>'Photo uploadée avec succès !',
            'photo'=>$user->photo,
        ]);
    }

    
        //upload cin et diplome
        public function uploadDocuments(Request $request){
            $request->validate([
                'cin'=>'required|image|mimes:jpg,jpeg,png|max:2048',
                'diplome'=>'required|image|mimes:jpg,jpeg,png|max:2048'
            ]);
            $enseignant = Enseignant::where('utilisateur_id',Auth::id())->first();
            //recuperation d'image
            $fileCin = $request->file('cin');
            
        }

    
}

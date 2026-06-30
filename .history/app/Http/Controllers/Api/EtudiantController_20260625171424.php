<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Etudiant;
use App\Models\User;
use App\Models\Reservation;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class EtudiantController extends Controller
{
    // recuperer le profil de l'etudiant connecte avec ses infos user
    public function show(){
        $etudiant = Etudiant::with('user')->where('utilisateur_id', Auth::id())->first();
        if (!$etudiant){
            return response()->json(['message'=>'Etudiant non trouve!'], 404);
        }
        return response()->json([
            'utilisateur_id'=>$etudiant->utilisateur_id,
            'nom'=>$etudiant->user->nom,
            'prenom'=>$etudiant->user->prenom,
            'email'=>$etudiant->user->email,
            'telephone'=>$etudiant->user->telephone ?? '',
            'ville'=>$etudiant->user->ville ?? '',
            'photo'=>$etudiant->user->photo ?? null,
            'niveau'=>$etudiant->niveau ?? '',
            'budget'=>$etudiant->budget ?? '',
        ]);
    }

    // mettre a jour le profil etudiant et user
    public function update(Request $request){
        $request->validate([
            'nom'=>'sometimes|string|max:255',
            'prenom'=>'sometimes|string|max:255',
            'telephone'=>'sometimes|string|max:20',
            'ville'=>'sometimes|string|max:255',
            'niveau'=>'sometimes|string|max:255',
            'budget'=>'sometimes|numeric|min:0',
        ]);
        $etudiant = Etudiant::where('utilisateur_id', Auth::id())->first();
        if (!$etudiant){
            return response()->json(['message'=>'Etudiant non trouve!'], 404);
        }
        // mise a jour table etudiants
        $etudiant->update($request->only(['niveau','budget']));
        $user = User::find(Auth::id());
        if (!$user){
            return response()->json(['message'=>'Utilisateur non trouve!'], 404);
        }
        // mise a jour table users
        $user->update($request->only(['nom','prenom','telephone','ville']));
        return response()->json(['message'=>'Profil mis a jour avec succes!']);
    }

    // uploader la photo de profil
    public function uploadPhoto(Request $request){
        $request->validate(['photo'=>'required|image|mimes:jpg,jpeg,png|max:2048']);
        $user = User::find(Auth::id());
        if (!$user){
            return response()->json(['message'=>'Utilisateur non trouve!'], 404);
        }
        // supprimer l'ancienne photo si elle existe
        if ($user->photo){
            Storage::disk('public')->delete($user->photo);
        }
        $file = $request->file('photo');
        $filename = 'photo_'.Auth::id().'_'.time().'.'.$file->getClientOriginalExtension();
        $user->photo = $file->storeAs('photos/profil', $filename, 'public');
        $user->save();
        return response()->json(['message'=>'Photo telechargee avec succes!','photo'=>$user->photo]);
    }

    // afficher le tableau de bord avec les statistiques
    public function dashboard(){
        $etudiant = Etudiant::with(['demandes','avis','reservations.creneau.enseignant.user'])->where('utilisateur_id', Auth::id())->first();
        if (!$etudiant){
            return response()->json(['message'=>'Etudiant non trouve!'], 404);
        }
        // calcul des statistiques
        $stats = [
            'total_reservations'=>$etudiant->reservations->count(),
            'total_demandes'=>$etudiant->demandes->count(),
            'total_avis'=>$etudiant->avis->count(),
        ];
        return response()->json(['etudiant'=>$etudiant,'stats'=>$stats]);
    }

    // recuperer toutes les reservations de l'etudiant
    public function reservations(){
        $etudiant = Etudiant::where('utilisateur_id', Auth::id())->first();
        if (!$etudiant){
            return response()->json(['message'=>'Etudiant non trouve!'], 404);
        }
        $reservations = Reservation::with(['creneau.enseignant.user'])->where('utilisateur_id', Auth::id())->orderBy('created_at','desc')->get();
        return response()->json($reservations);
    }
}
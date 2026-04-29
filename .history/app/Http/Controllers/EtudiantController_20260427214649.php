<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Etudiant;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;



class EtudiantController extends Controller
{
    // profil etudiant connecte
    public function show(){
        $etudiant = Etudiant::with('user')->where('utilisateur_id',Auth::id())->first();//with('user'):car nom prenom photo ville sont dans la table users
        if(!$etudiant){
            return response()->json([
                'message' => 'Etudiant intoruvable !'
            ],404);
        }
        return response()->json($etudiant); // return student data as JSON response for API (frontend)
    }

    //modifier profil etudiant
    public function update(Request $request){
        $request->validate([
            'nom'=>'string|max:255',
            'prenom'=>'string|max:255',
            'ville'=>'string',
            'niveau'=>'string',
            'budget'=>'numeric|min:0'
        ]);

        //cherche l'etudiant connectee
        $etudiant = Etudiant::where('utilisateur_id',Auth::id())->first();

        if(!$etudiant){
            return response()->json([
                'message'=>'Etudiant introuvable !'

            ],404);
        }

        $etudiant->update($request->only([
            'niveau','budget'

        ]));

        //cherche user connectee car les autres champs dans la table users
        $user = User::find(Auth::id());

        if(!$user){
            return response()->json([

            ],);
        }

    }
}
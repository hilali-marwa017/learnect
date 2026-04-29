<?php

namespace App\Http\Controllers\Api;

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
                'message'=>'User introuvable !'

            ],404);
        }

        //modification des colonne de la table users
        $user->update($request->only([
            'nom','prenom','telephone','ville'

        ]));

        return response()->json([
            'message'=>'Profil modifié avec succès !',
            'etudiant'=>$etudiant,
        ]);

    }

    //upload pdf
    public function uploadPhoto(Request $request){
        $request->validate([
            'photo'=>'required|image|mimes:jpg,jpeg,png|max:2048'
        ]);

        $user = User::find(Auth::id());
        if(!$user){
            return response()->json([
                'message' => 'User introuvable !'
            ],404);
        }

        if($user->photo){
            Storage::disk('public')->delete($user->photo);
        }

        if($request->hasFile('photo')){
            $file = $request->file('photo'); //recupere le fichier uploadee

            //cree un nom unique pour eviter les conflits
$filename = 'photo_' . Auth::id() . '_' . time() . '.' . $file->getClientOriginalExtension();
            $user->photo = $file->storeAs('photos/profil',$filename,'public');
            $user->save();//sauvegare dans BDD
        }

        return response()->json([
            'message'=>'Photo uploadée avec succès !',
            'photo'=>$user->photo,
        ]);
    }

    public function dashboard(){
        $etudiant = Etudiant::with('reservations','demandes','avis')->where('utilisateur_id', Auth::id())->first();

        // Securite : si etudiant pas trouvee → erreur 404
        if (!$etudiant) {
            return response()->json([
                'message' => 'Etudiant introuvable !'
            ],404);
        }
        $stats = [
            'total_reservations'=>$etudiant->reservations->count(),
            'total_demandes'=>$etudiant->demandes->count(),
            'total_avis'=>$etudiant->avis->count(),
        ];
        return response()->json([
            'etudiant'=>$etudiant,
            'stats'=>$stats,
        ]);

    }
}
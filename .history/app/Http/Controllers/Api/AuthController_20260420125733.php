<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Etudiant;
use App\Models\Enseignant;
use Illuminate\Support\Facades\Auth; 
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    //inscription

    public function register(Request $request){
        //validation

        $request->validate([
            'nom'=>'required|string|max:255|min:3',
            'prenom'=>'required|string|max:255|min:3',
            'email'=>'required|email|unique:users,email',
            'password'=>'required|min:8|confirmed',
            'telephone'=>'required|string|unique:users,telephone', //unique dans la table users
            'ville'=>'required|string',
            'role'=>'required|in:etudiant,enseignant',
        ]);

        //2-creer le user
        $user = User::create([
            'nom'=>$Request->nom,
            'prenom'=>$request->prenom,
            'email'=>$request->email,
            'password'=>$request->password,
            'telephone'=>$request->telephone,
            'ville'=>$request->ville,
            'role'=>$request->role,
            'statut'=>'en_attente',
        ]);

        //3- creer profil selon role
        if($request->role === 'etudiant'){
            Etudiant::create([
                'utilisateur_id'=>$user->utilisateur_id,

            ]);
        } else{
            Enseignant::create([
                'utilisateur_id'=>$user->utilisateur_id,
            ]);
        }
        //4- connecter automatiquement l'utilsateur au systeme
        Auth::login($user); // auth c le systeme de (login/logout,checkUser,Session)

        //5-Token Santcum
        $token = $user->createToken('learnect-token')->plainTextToken;
        return response()->json([
            'message'=>'Compte créé avec succès !',
            'user'=>$user,
            'token'=>$token,

        ],201); //status code ('something created succesfully')

    }

    //Connexion
    public function login(Request $request){
        //1- validation 
        $request->validate([
            'email'=>'required|email',
            'password'=>'required'

        ]);

        //2- tentative connexion
        $credentias = $reqest->only('email','password');

        if(Auth::attempt($credentias)){
            //3- recuperer user
            $user = Auth::user();

            //4 verifier si bloque par admin ou systeme
            if($user->statut === 'bloque'){
                Auth::logout();
                return response()->json([
                    'message'=>'Votre compte a été bloqué !'

                ],403);


                $token = $user->createToken('learnect-token')->plainTextToken;

                return response()->json([
                'message'=> 'Connecté avec succès !',
                'user'=> $user,
                'token'=> $token
                ]);

            }

            //echec
            return response()->json([
                'message'=>'email ou mot de passe incorrect'
            ],401);

        }

        //deconnexion
        public function logout (Request $request){
            Auth::logout();

            //supprimer Santcum token
        }
    }


    
}

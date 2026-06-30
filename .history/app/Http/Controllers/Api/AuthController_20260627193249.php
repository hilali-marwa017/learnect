<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Etudiant;
use App\Models\Enseignant;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        // validation commune
        $request->validate([
            'nom' => 'required|string|max:255|min:3',
            'prenom' => 'required|string|max:255|min:3',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:8|confirmed',
            'telephone' => 'required|string|unique:users,telephone',
            'ville' => 'required|string',
            'role' => 'required|in:etudiant,enseignant',
            'niveau' => 'nullable|string',
            'budget' => 'nullable|numeric',
            'photo' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        // validation documents si enseignant
        if ($request->role === 'enseignant') {
            $request->validate([
                'cin_recto' => 'required|image|mimes:jpg,jpeg,png|max:2048',
                'cin_verso' => 'required|image|mimes:jpg,jpeg,png|max:2048',
                'diplome' => 'required|mimes:pdf|max:5120',
            ]);
        }

        // creer le user
        $user = User::create([
            'nom' => $request->nom,
            'prenom' => $request->prenom,
            'email' => $request->email,
            'password' => $request->password,
            'telephone' => $request->telephone,
            'ville' => $request->ville,
            'role' => $request->role,
            'statut' => $request->role === 'enseignant' ? 'en_attente' : 'actif',
            'can_learn' => true,
            'can_teach' => $request->role === 'enseignant'
        ]);

        // sauvegarde de la photo pour les 2 roles
        if ($request->hasFile('photo')) {
            $filePhoto = $request->file('photo');
            $namePhoto = 'photo_' . $user->utilisateur_id . '_' . time() . '.' . $filePhoto->getClientOriginalExtension();
            $user->photo = $filePhoto->storeAs('photos/profil', $namePhoto, 'public');
            $user->save();
        }

        // creer profil etudiant
        if ($request->role === 'etudiant') {
            Etudiant::create([
                'utilisateur_id' => $user->utilisateur_id,
                'niveau' => $request->niveau,
                'budget' => $request->budget
            ]);

        // creer profil enseignant + docs
        } else {
            // CIN recto — image
            $fileRecto = $request->file('cin_recto');
            $nameRecto = 'cin_recto_' . $user->utilisateur_id . '_' . time() . '.' . $fileRecto->getClientOriginalExtension();
            $pathRecto = $fileRecto->storeAs('documents/cin', $nameRecto, 'public');

            // CIN verso — image
            $fileVerso = $request->file('cin_verso');
            $nameVerso = 'cin_verso_' . $user->utilisateur_id . '_' . time() . '.' . $fileVerso->getClientOriginalExtension();
            $pathVerso = $fileVerso->storeAs('documents/cin', $nameVerso, 'public');

            // diplome — pdf
            $fileDiplome = $request->file('diplome');
            $nameDiplome = 'diplome_' . $user->utilisateur_id . '_' . time() . '.' . $fileDiplome->getClientOriginalExtension();
            $pathDiplome = $fileDiplome->storeAs('documents/diplome', $nameDiplome, 'public');

            // sauvegarder tous les champs du formulaire
            Enseignant::create([
                'utilisateur_id' => $user->utilisateur_id,
                'cin_recto' => $pathRecto,
                'cin_verso' => $pathVerso,
                'diplome' => $pathDiplome,
                'statut_annonce' => 'brouillon',
                'titre' => $request->titre,
                'description_profil' => $request->description_profil,
                'description_cours' => $request->description_cours,
                'tarifHeure' => $request->tarifHeure,
                'langues' => $request->langues,
                'cours_domicile' => $request->cours_domicile ?? false,
                'cours_enligne' => $request->cours_enligne ?? false,
                'cours_deplacement' => $request->cours_deplacement ?? false,
            ]);
        }

        // login auto apres inscription
        Auth::login($user);
        $token = $user->createToken('learnect-token')->plainTextToken;

        return response()->json([
            'message' => 'Compte créé avec succès !',
            'user' => $user,
            'token' => $token,
        ], 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if (Auth::attempt($request->only('email', 'password'))) {

            $user = Auth::user();

            // compte bloquee
            if ($user->statut === 'bloque') {
                Auth::logout();
                return response()->json([
                    'message' => 'Votre compte a été bloqué !'
                ], 403);
            }

            // enseignant en attente de validation
            if ($user->role === 'enseignant' && $user->statut === 'en_attente') {
                Auth::logout();
                return response()->json([
                    'message' => "Votre compte est en attente de validation par l'admin !"
                ], 403);
            }

            $token = $user->createToken('learnect-token')->plainTextToken;

            return response()->json([
                'message' => 'Connecté avec succès !',
                'user' => $user,
                'token' => $token,
            ]);
        }

        return response()->json([
            'message' => 'Email ou mot de passe incorrect'
        ], 401);
    }

    public function logout(Request $request)
    {
        auth('sanctum')->user()->tokens()->delete();
        return response()->json(['message' => 'Déconnecté avec succès !']);
    }

    public function me(Request $request)
    {
        return response()->json(Auth::user());
    }
}
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
    // INSCRIPTION
    public function register(Request $request)
    {
        // VALIDATION BASE
        $request->validate([
            'nom' => 'required|string|max:255|min:3',
            'prenom' => 'required|string|max:255|min:3',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:8|confirmed',
            'telephone' => 'required|string|unique:users,telephone',
            'ville' => 'required|string',
            'role' => 'required|in:etudiant,enseignant',
        ]);

        // VALIDATION DOCUMENTS SI ENSEIGNANT
        if ($request->role === 'enseignant') {

            $request->validate([
                'cin_recto' => 'required|image|mimes:jpg,jpeg,png|max:2048',
                'cin_verso' => 'required|image|mimes:jpg,jpeg,png|max:2048',
                'diplome' => 'required|image|mimes:jpg,jpeg,png|max:2048',
            ]);
        }

        // CREER USER
        $user = User::create([
            'nom' => $request->nom,
            'prenom' => $request->prenom,
            'email' => $request->email,

            // HASH PASSWORD
            'password' => Hash::make($request->password),

            'telephone' => $request->telephone,
            'ville' => $request->ville,
            'role' => $request->role,

            // enseignant en attente admin
            'statut' => $request->role === 'enseignant'
                ? 'en_attente'
                : 'actif',

            'can_learn' => true,
            'can_teach' => $request->role === 'enseignant',
        ]);

        // CREER ETUDIANT
        if ($request->role === 'etudiant') {

            Etudiant::create([
                'utilisateur_id' => $user->utilisateur_id,
            ]);
        }

        // CREER ENSEIGNANT
        else {

            // CIN RECTO
            $fileRecto = $request->file('cin_recto');

            $nameRecto =
                'cin_recto_' .
                $user->utilisateur_id .
                '_' .
                time() .
                '.' .
                $fileRecto->getClientOriginalExtension();

            $pathRecto = $fileRecto->storeAs(
                'documents/cin',
                $nameRecto,
                'public'
            );

            // CIN VERSO
            $fileVerso = $request->file('cin_verso');

            $nameVerso =
                'cin_verso_' .
                $user->utilisateur_id .
                '_' .
                time() .
                '.' .
                $fileVerso->getClientOriginalExtension();

            $pathVerso = $fileVerso->storeAs(
                'documents/cin',
                $nameVerso,
                'public'
            );

            // DIPLOME
            $fileDiplome = $request->file('diplome');

            $nameDiplome =
                'diplome_' .
                $user->utilisateur_id .
                '_' .
                time() .
                '.' .
                $fileDiplome->getClientOriginalExtension();

            $pathDiplome = $fileDiplome->storeAs(
                'documents/diplome',
                $nameDiplome,
                'public'
            );

            Enseignant::create([
                'utilisateur_id' => $user->utilisateur_id,

                'cin_recto' => $pathRecto,
                'cin_verso' => $pathVerso,
                'diplome' => $pathDiplome,

                'statut_annonce' => 'brou',
            ]);
        }

        // LOGIN AUTO
        Auth::login($user);

        $token = $user->createToken('learnect-token')->plainTextToken;

        return response()->json([
            'message' => 'Compte créé avec succès !',
            'user' => $user,
            'token' => $token,
        ], 201);
    }

    // CONNEXION
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $credentials = $request->only('email', 'password');

        if (Auth::attempt($credentials)) {

            $user = Auth::user();

            // USER BLOQUE
            if ($user->statut === 'bloque') {

                Auth::logout();

                return response()->json([
                    'message' => 'Votre compte a été bloqué !'
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

    // DECONNEXION
    public function logout(Request $request)
    {
        auth('sanctum')->user()->tokens()->delete();

        return response()->json([
            'message' => 'Déconnecté avec succès !',
        ]);
    }

    // USER CONNECTE
    public function me(Request $request)
    {
        return response()->json(Auth::user());
    }
}
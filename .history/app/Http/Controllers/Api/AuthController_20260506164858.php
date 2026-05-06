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
        $request->validate([
            'nom' => 'required|string|max:255|min:3',
            'prenom' => 'required|string|max:255|min:3',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:8|confirmed',
            'telephone' => 'required|string|unique:users,telephone',
            'ville' => 'required|string',
            'role' => 'required|in:etudiant,enseignant',
        ]);

        // CREATE USER
        $user = User::create([
            'nom' => $request->nom,
            'prenom' => $request->prenom,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'telephone' => $request->telephone,
            'ville' => $request->ville,
            'role' => $request->role,
            'statut' => 'en_attente',
            'can_learn' => true,
            'can_teach' => $request->role === 'enseignant',
        ]);

        // PROFILE
        if ($request->role === 'etudiant') {
            Etudiant::create([
                'utilisateur_id' => $user->utilisateur_id,
            ]);
        } else {
            Enseignant::create([
                'utilisateur_id' => $user->utilisateur_id,
            ]);
        }

        // TOKEN (IMPORTANT)
        $token = $user->createToken('learnect-token')->plainTextToken;

        return response()->json([
            'message' => 'Compte créé avec succès !',
            'user' => $user,
            'token' => $token,
        ], 201);
    }

    // LOGIN
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json([
                'message' => 'Email ou mot de passe incorrect'
            ], 401);
        }

        $user = Auth::user();

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

    // LOGOUT
    public function logout(Request $request)
    {
        $user = $request->user();

        if ($user && $user->currentAccessToken()) {
            $user->currentAccessToken()->delete();
        }

        return response()->json([
            'message' => 'Déconnecté avec succès !',
        ]);
    }

    // ME
    public function me(Request $request)
    {
        return response()->json($request->user());
    }
}
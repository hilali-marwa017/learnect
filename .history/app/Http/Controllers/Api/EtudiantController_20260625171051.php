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
    public function show(){
        $etudiant = Etudiant::with('user')->where('utilisateur_id', Auth::id())->first();

        if (!$etudiant){
            return response()->json(['message' => 'Etudiant introuvable !'], 404);
        }

        return response()->json([
            'utilisateur_id'=>$etudiant->utilisateur_id,
            'nom'=>$etudiant->user->nom,
            'prenom'=>$etudiant->user->prenom,
            'email'=>$etudiant->user->email,
            'telephone'    =>$etudiant->user->telephone ?? '',
            'ville'          =>$etudiant->user->ville ?? '',
            'photo'          =>$etudiant->user->photo ?? null,
            'niveau'         =>$etudiant->niveau ?? '',
            'budget'         =>$etudiant->budget ?? '',
        ]);
    }

    // ─── PUT /etudiant/profile ───────────────────────────────────────────────
    public function update(Request $request)
    {
        $request->validate([
            'nom'       => 'sometimes|string|max:255',
            'prenom'    => 'sometimes|string|max:255',
            'telephone' => 'sometimes|string|max:20',
            'ville'     => 'sometimes|string|max:255',
            'niveau'    => 'sometimes|string|max:255',
            'budget'    => 'sometimes|numeric|min:0',
        ]);

        $etudiant = Etudiant::where('utilisateur_id', Auth::id())->first();

        if (!$etudiant) {
            return response()->json(['message' => 'Etudiant introuvable !'], 404);
        }

        // Mise à jour table etudiants
        $etudiant->update($request->only(['niveau', 'budget']));

        // Mise à jour table users
        $user = User::find(Auth::id());

        if (!$user) {
            return response()->json(['message' => 'User introuvable !'], 404);
        }

        $user->update($request->only(['nom', 'prenom', 'telephone', 'ville']));

        return response()->json([
            'message' => 'Profil modifié avec succès !',
        ]);
    }

    // ─── POST /etudiant/photo ─────────────────────────────────────────────────
    public function uploadPhoto(Request $request)
    {
        $request->validate([
            'photo' => 'required|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        $user = User::find(Auth::id());

        if (!$user) {
            return response()->json(['message' => 'User introuvable !'], 404);
        }

        // Supprimer ancienne photo si elle existe
        if ($user->photo) {
            Storage::disk('public')->delete($user->photo);
        }

        $file     = $request->file('photo');
        $filename = 'photo_' . Auth::id() . '_' . time() . '.' . $file->getClientOriginalExtension();
        $user->photo = $file->storeAs('photos/profil', $filename, 'public');
        $user->save();

        return response()->json([
            'message' => 'Photo uploadée avec succès !',
            'photo'   => $user->photo,
        ]);
    }

    // ─── GET /etudiant/dashboard ──────────────────────────────────────────────
    public function dashboard()
    {
        $etudiant = Etudiant::with([
            'demandes',
            'avis',
            'reservations.creneau.enseignant.user', // pour acceder aux infos prof
        ])
        ->where('utilisateur_id', Auth::id())
        ->first();

        if (!$etudiant) {
            return response()->json(['message' => 'Etudiant introuvable !'], 404);
        }

        $stats = [
            'total_reservations' => $etudiant->reservations->count(),
            'total_demandes'     => $etudiant->demandes->count(),
            'total_avis'         => $etudiant->avis->count(),
        ];

        return response()->json([
            'etudiant' => $etudiant,
            'stats'    => $stats,
        ]);
    }

    // ─── GET /reservations ────────────────────────────────────────────────────
    // Utilisé par StudentDashboard + StudentReservations + StudentMessages
    public function reservations()
    {
        $etudiant = Etudiant::where('utilisateur_id', Auth::id())->first();

        if (!$etudiant) {
            return response()->json(['message' => 'Etudiant introuvable !'], 404);
        }

        $reservations = Reservation::with([
            'creneau.enseignant.user', // prenom + nom du prof
        ])
        ->where('utilisateur_id', Auth::id())
        ->orderBy('created_at', 'desc')
        ->get();

        return response()->json($reservations);
    }
}
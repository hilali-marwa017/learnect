<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Etudiant;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class EtudiantController extends Controller
{
    // Profil étudiant connecté
    public function show()
    {
        $etudiant = Etudiant::with('user')
            ->where('utilisateur_id', Auth::id())
            ->first();

        if (!$etudiant) {
            return response()->json([
                'message' => 'Etudiant introuvable !'
            ], 404);
        }

        return response()->json($etudiant);
    }

    // Modifier profil étudiant
    public function update(Request $request)
    {
        $request->validate([
            'niveau' => 'string',
            'budget' => 'numeric|min:0',
            'nom'    => 'string|max:255',
            'prenom' => 'string|max:255',
            'ville'  => 'string',
        ]);

        $etudiant = Etudiant::where('utilisateur_id', Auth::id())->first();

        if (!$etudiant) {
            return response()->json([
                'message' => 'Etudiant introuvable !'
            ], 404);
        }

        $etudiant->update($request->only([
            'niveau',
            'budget',
        ]));

        $user = User::find(Auth::id());

        if (!$user) {
            return response()->json([
                'message' => 'User introuvable !'
            ], 404);
        }

        $user->update($request->only([
            'nom',
            'prenom',
            'telephone',
            'ville',
        ]));

        return response()->json([
            'message'  => 'Profil modifié avec succès !',
            'etudiant' => $etudiant,
        ]);
    }

    // Upload photo profil
    public function uploadPhoto(Request $request)
    {
        $request->validate([
            'photo' => 'required|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        $user = User::find(Auth::id());

        if (!$user) {
            return response()->json([
                'message' => 'User introuvable !'
            ], 404);
        }

        if ($user->photo) {
            Storage::disk('public')->delete($user->photo);
        }

        if ($request->hasFile('photo')) {
            $file = $request->file('photo');

            $filename = 'photo_' . Auth::id() . '_' . time() . '.' . $file->getClientOriginalExtension();

            $user->photo = $file->storeAs('photos/profil', $filename, 'public');
            $user->save();
        }

        return response()->json([
            'message' => 'Photo uploadée avec succès !',
            'photo'   => $user->photo,
        ]);
    }

    // Dashboard étudiant
    public function dashboard()
    {
        $etudiant = Etudiant::with('reservations', 'demandes', 'avis')
            ->where('utilisateur_id', Auth::id())
            ->first();

        if (!$etudiant) {
            return response()->json([
                'message' => 'Etudiant introuvable !'
            ], 404);
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
}
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Enseignant;
use App\Models\Reservation;
use App\Models\Avis;
use App\Models\Paiement;
use App\Models\Demande;

class AdminController extends Controller
{
    public function stats(){
        return response()->json([
            'total_etudiants'    => User::where('role','etudiant')->count(),
            'total_enseignants'  => User::where('role','enseignant')->count(),
            'total_reservations' => Reservation::count(),
            'total_avis'         => Avis::count(),
            'revenus_total'      => Paiement::where('statut','paye')->sum('comission'),
        ]);
    }

    public function Users(Request $request){
        $query = User::query();
        if ($request->filled('role'))   $query->where('role',   $request->role);
        if ($request->filled('statut')) $query->where('statut', $request->statut);
        return response()->json($query->orderBy('created_at','desc')->get());
    }

    public function bloquer(User $user){
        $user->update(['statut' => 'bloque']);
        return response()->json(['message' => 'Utilisateur bloqué avec succès !']);
    }

    public function debloquer(User $user){
        $user->update(['statut' => 'actif']);
        return response()->json(['message' => 'Utilisateur débloqué avec succès !']);
    }

    public function destroy(User $user){
        $user->delete();
        return response()->json(['message' => 'Utilisateur supprimé avec succès !']);
    }

    public function enseignantsEnAttente(){
        $enseignants = Enseignant::with('user')->where('estVerifie', false)->get();

        return response()->json($enseignants->map(function($e) {
            $documents = [];
            if ($e->cin_recto) $documents[] = ['type_document' => 'CIN Recto', 'chemin' => $e->cin_recto];
            if ($e->cin_verso) $documents[] = ['type_document' => 'CIN Verso', 'chemin' => $e->cin_verso];
            if ($e->diplome)   $documents[] = ['type_document' => 'Diplôme',   'chemin' => $e->diplome];

            return [
                'utilisateur_id'    => $e->utilisateur_id,
                'description_profil'=> $e->description_profil,
                'titre'             => $e->titre,
                'tarifHeure'        => $e->tarifHeure,
                'user'              => $e->user,
                'documents'         => $documents,
            ];
        }));
    }

    public function validerEnseignant(Enseignant $enseignant){
        $enseignant->update(['estVerifie' => true]);
        $enseignant->user->update(['statut' => 'actif']);
        return response()->json(['message' => 'Enseignant validé avec succès !']);
    }

    public function refuserEnseignant(Request $request, Enseignant $enseignant){
        $request->validate(['raison' => 'required|string|min:3|max:255']);
        $enseignant->user->update(['statut' => 'en_attente']);
        return response()->json([
            'message' => 'Enseignant refusé !',
            'raison'  => $request->raison,
        ]);
    }

    public function supprimerAvis(Avis $avis){
        $avis->delete();
        return response()->json(['message' => 'Avis supprimé avec succès !']);
    }

    public function demandes(){
        return response()->json(
            Demande::with('etudiant')->orderBy('created_at','desc')->get()
        );
    }

    public function reservations(){
        return response()->json(
            Reservation::with('etudiant','creneau.enseignant.user','paiement')
                ->orderBy('created_at','desc')->get()
        );
    }

    public function paiements(){
        return response()->json(
            Paiement::with('reservation.etudiant')->orderBy('created_at','desc')->get()
        );
    }
}
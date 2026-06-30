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
    // statistiques globales
    public function stats(){
        return response()->json([
            'total_etudiants'    => User::where('role', 'etudiant')->count(),
            'total_enseignants'  => User::where('role', 'enseignant')->count(),
            'total_reservations' => Reservation::count(),
            'total_avis'         => Avis::count(),
            'revenus_total'      => Paiement::where('statut', 'paye')->sum('comission'),
        ]);
    }

    // ✅ CORRIGÉ : users() en camelCase au lieu de Users()
    public function users(Request $request){
        $query = User::query();
        if ($request->filled('role'))   $query->where('role',   $request->role);
        if ($request->filled('statut')) $query->where('statut', $request->statut);
        return response()->json($query->orderBy('created_at', 'desc')->get());
    }

    // bloquer un utilisateur
    public function bloquer(User $user){
        if ($user->statut === 'refuse') {
            return response()->json([
                'message' => 'Ce compte a été refusé lors de la vérification. Utilisez l\'onglet Vérifications.'
            ], 422);
        }

        $user->update(['statut' => 'bloque']);
        return response()->json(['message' => 'Utilisateur bloqué avec succès !']);
    }

    // debloquer un utilisateur
    public function debloquer(User $user){
        if ($user->statut === 'refuse') {
            return response()->json([
                'message' => 'Ce compte a été refusé lors de la vérification. Il doit être validé via l\'onglet Vérifications, pas débloqué.'
            ], 422);
        }

        $user->update(['statut' => 'actif']);
        return response()->json(['message' => 'Utilisateur débloqué avec succès !']);
    }

    // supprimer un utilisateur
    public function destroy(User $user){
        if ($user->role === 'admin') {
            return response()->json(['message' => 'Impossible de supprimer un compte administrateur.'], 422);
        }

        $user->delete();
        return response()->json(['message' => 'Utilisateur supprimé avec succès !']);
    }

    // liste des enseignants en attente de verification
    public function enseignantsEnAttente(){
        $enseignants = Enseignant::with('user')
            ->where('estVerifie', false)
            ->whereHas('user', function ($q) {
                $q->where('statut', '!=', 'refuse');
            })
            ->get();

        $resultat = [];

        foreach ($enseignants as $e) {
            $documents = [];

            if ($e->cin_recto) {
                $documents[] = [
                    'type_document' => 'CIN Recto',
                    'chemin'        => $e->cin_recto,
                ];
            }
            if ($e->cin_verso) {
                $documents[] = [
                    'type_document' => 'CIN Verso',
                    'chemin'        => $e->cin_verso,
                ];
            }
            if ($e->diplome) {
                $documents[] = [
                    'type_document' => 'Diplôme',
                    'chemin'        => $e->diplome,
                ];
            }

            $resultat[] = [
                'utilisateur_id'    => $e->utilisateur_id,
                'description_profil'=> $e->description_profil,
                'titre'             => $e->titre,
                'tarifHeure'        => $e->tarifHeure,
                'user'              => $e->user,
                'documents'         => $documents,
            ];
        }

        return response()->json($resultat);
    }

    // valider un enseignant
    public function validerEnseignant($id){
        $enseignant = Enseignant::where('utilisateur_id', $id)->first();

        if (!$enseignant) {
            return response()->json([
                'message' => "Aucun dossier enseignant trouvé pour l'utilisateur #{$id}."
            ], 404);
        }

        $enseignant->update([
            'estVerifie'     => true,
            'statut_annonce' => 'en_ligne',
            'raison_refus'   => null,
        ]);
        $enseignant->user->update(['statut' => 'actif']);

        return response()->json(['message' => 'Enseignant validé avec succès !']);
    }

    // refuser un enseignant
    public function refuserEnseignant(Request $request, $id){
        $request->validate([
            'raison' => 'required|string|min:3|max:500'
        ]);

        $enseignant = Enseignant::where('utilisateur_id', $id)->first();

        if (!$enseignant) {
            return response()->json([
                'message' => "Aucun dossier enseignant trouvé pour l'utilisateur #{$id}."
            ], 404);
        }

        $enseignant->update([
            'raison_refus' => $request->raison,
        ]);

        $enseignant->user->update(['statut' => 'refuse']);

        return response()->json([
            'message' => 'Enseignant refusé !',
            'raison'  => $request->raison,
        ]);
    }

    // supprimer un avis
    public function supprimerAvis(Avis $avis){
        $avis->delete();
        return response()->json(['message' => 'Avis supprimé avec succès !']);
    }

    // liste des demandes
    public function demandes(){
        $demandes = Demande::with('etudiant')->orderBy('created_at', 'desc')->get();
        return response()->json($demandes);
    }

    // liste des reservations
    public function reservations(){
        $reservations = Reservation::with('etudiant', 'creneau.enseignant.user', 'paiement')
                                   ->orderBy('created_at', 'desc')
                                   ->get();
        return response()->json($reservations);
    }

    // liste des paiements
    public function paiements(){
        $paiements = Paiement::with('reservation.etudiant')
                             ->orderBy('created_at', 'desc')
                             ->get();
        return response()->json($paiements);
    }
}
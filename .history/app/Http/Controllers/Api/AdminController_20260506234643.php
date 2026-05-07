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
            'total_etudiants'=>User::where('role','etudiant')->count(),
            'total_enseignants'=>User::where('role','enseignant')->count(),
            'total_reservations'=>Reservation::count(),
            'total_avis'=>Avis::count(),
            'revenus_total'=>Paiement::where('statut','paye')->sum('comission'),
        ]);
    }

    public function Users(Request $request){
        $query = User::query();

        if ($request->filled('role')) {
            $query->where('role',$request->role);
        }

        if ($request->filled('statut')) {
            $query->where('statut',$request->statut);
        }

        return response()->json(
            $query->orderBy('created_at','desc')->get()
        );
    }

    // Bloquer user
    public function bloquer(User $user){
        $user->update(['statut'=>'bloque']);

        return response()->json([
            'message'=>'Utilisateur bloqué avec succès !'
        ]);
    }

    // Debloquer user
    public function debloquer(User $user){
        $user->update(['statut'=>'actif']);

        return response()->json([
            'message'=>'Utilisateur débloqué avec succès !'
        ]);
    }

    // Supprimer user
    public function destroy(User $user){
        $user->delete();

        return response()->json([
            'message'=>'Utilisateur supprimé avec succès !'
        ]);
    }

    public function enseignantsEnAttente(){
        $enseignants = Enseignant::with('user','documents')->where('estVerifie',false)->get();
        return response()->json($enseignants);


    }

    public function validerEnseignant(Enseignant $enseignant){
        $enseignant->update(['estVerifie'=>true]);
        //recuperer le compte user liee a  enseignant pour modifier le statut dans user tables
        $enseignant->user->update(['statut'=>'actif']);

        return response()->json([
            'message'=>'Enseignant validé avec succès !'
        ]);
    }

    public function refuserEnseignant(Request $request, Enseignant $enseignant){
        // validation de la raison
        $request->validate(['raison'=>'required|string|min:3|max:255']);

        //mettre le statut user en attente
        $enseignant->user->update(['statut'=>'en_attente']);

        return response()->json([
            'message'=>'Enseignant refusé !',
            'raison'=>$request->raison
        ]);
    }

    public function supprimerAvis(Avis $avis){
        $avis->delete();

        return response()->json([
            'message'=>'Avis supprimé avec succès !'
        ]);
    }

    public function demandes(){
        $demandes = Demande::with('etudiant')->odrderBy('created_at','desc')->get();
        return response()->json($demandes);
    }

    public function reservations(){
        $reservations = Reservation::with('etudiant','creneau.enseignant.user','paiement')->orderBy('created_at','desc')->get();
        return response()->json($reservations);
    }

    public function paiements(){
        $paiements = Paiement::with('reservation.etudiant')->orderBy('created_at','desc')->get();
        return response()->json($paiements);
    }
}
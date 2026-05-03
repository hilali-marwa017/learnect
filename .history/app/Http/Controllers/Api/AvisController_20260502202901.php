<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Avis;
use App\Models\Reservation;
use App\Models\Enseignant;
use Illuminate\Support\Facades\Auth;

class AvisController extends Controller
{
    //liste des avis d'un enseignant
    public function index($id_enseignant){
        $enseignant = Enseignant::find($id_enseignant); //pk

        if (!$enseignant) {
            return response()->json([
                'message'=>'Enseignant introuvable !'
            ],404);
        }

        //charge les avis avec les infos de l'etudiant
        $avis = Avis::with('etudiant')->where('id_enseignant',$id_enseignant)->get();

        return response()->json($avis);

    }

    //laisser un avis
    public function store(Request $request){
        $request->validate([
            'note'=>'required|integer|min:1|max:5',
            'commentaire'=>'required|string|min:10',
            'id_enseignant'=>'required|exists:enseignants,utilisateur_id',
            'id_reservation'=>'required|exists:reservations,id_reservation'
        ]);
        
        //verifier que la reservation est terminee
          $reservation = Reservation::where('id_reservation',$request->id_reservation)->where('id_utilisateur', Auth::id())->where('statut', 'terminee')->first();

        if (!$reservation) {
            return response()->json([
                'message'=>'Vous ne pouvez pas laisser un avis avant la fin du cours !'
            ],400);
        }

        //creer un avis
        $avisv = Avis::create([
            'note'=>$request->note,
            'commentaire'=>$request->commentaire,
            'id_utilisateur'=>Auth::id(),
            'id_enseignant'=>$request->id_enseignant,
            'id_reservation'=>$request->id_reservation
        ]);

        //calculer la note moyenne de l'enseignant 
        $noteMoyenne = Avis::where('id_enseignant',$request->id_enseignant)->avg('note');

        //maj la noteMoyenne dans la table enseignants
        Enseignant::where('utilisateur_id', $request->id_enseignant)->update(['noteMoyenne'=>$noteMoyenne]);

         return response()->json([
            'message'=>'Avis laissé avec succès !',
            'avis'=>$avis,
        ],201);
    }

    //supprimer un avis
    public function destroy($id){
        $avis = Avis::where('id_avis', $id)->where('id_utilisateur', Auth::id())->first();

        if (!$avis) {
            return response()->json([
                'message'=>'Avis introuvable !'
            ],404);
        }

        // sauvegarde id_enseignant avant suppression
        $id_enseignant = $avis->id_enseignant;
        $avis->delete();

        //recalcuer la noteMoyenne apres supression
        $noteMoyenne = Avis::where('id_enseignant', $id_enseignant)->avg('note') ?? 0;

        //maj 
        Enseignant::where('utilisateur_id', $id_enseignant)->update(['noteMoyenne'=>$noteMoyenne]);
        return response()->json([
            'message' => 'Avis supprimé avec succès !'
        ]);




    }
}

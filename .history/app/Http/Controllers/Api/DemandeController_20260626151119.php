<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Demande;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class DemandeController extends Controller
{
    // liste de toutes les demandes 
    public function index(){
        $demandes = Demande::with('etudiant')->where('statut','active')>where('expire_at', '>', Carbon::now())->get();
        return response()->json($demandes);
    }

    // mes demandes (etudiant connectee)
    public function mesDemandes(){
        // charge les offres recues pour chaque demande
        $demandes = Demande::with('offres.enseignant.user')->where('id_utilisateur', Auth::id())->get();
        return response()->json($demandes);
    }

    // publier une demande
    public function store(Request $request){
        // validation adaptee au frontend (budget_max + message)
        $request->validate([
            'matiere'=>'required|string',
            'budget_max'=>'required|numeric|min:0',
            'message'=>'nullable|string',
        ]);

        $demande = Demande::create([
            'matiere'=>$request->matiere,
            'niveau'=>$request->niveau ?? 'Non precise',
            'budgetMin'=>0,
            'budgetMax'=>$request->budget_max,
            'ville'=>$request->ville ?? Auth::user()->ville,
            'message'=>$request->message ?? '',
            'statut'=>'active',
            'expire_at'=>Carbon::now()->addHours(48),
            'id_utilisateur'=>Auth::id(),
        ]);

        return response()->json([
            'message'=>'Demande publiee avec succes !',
            'demande'=>$demande,
        ], 201);
    }

    // supprimer une demande
    public function destroy($id){
        $demande = Demande::where('id_demande', $id)->where('id_utilisateur', Auth::id())->first();

        if(!$demande){
            return response()->json(['message' => 'Demande introuvable !'], 404);
        }

        $demande->delete();
        return response()->json(['message' => 'Demande supprimee avec succes !']);
    }
}
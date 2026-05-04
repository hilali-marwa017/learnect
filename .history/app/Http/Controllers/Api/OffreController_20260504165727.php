<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Offre;
use App\Models\Demande;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class OffreController extends Controller
{
    // offres d'une demande
    public function index($id_demande){
        $demande = Demande::find($id_demande);
        if (!$demande){
            return response()->json([
                'message'=>'Demande introuvable !'
            ],404);
        }
        $offres = Offre::with('enseignant.user')->where('id_demande',$id_demande)->get();
        return response()->json($offres);
    }

    // mes offres (enseignant)
    public function mesOffres(){
        $offres = Offre::with('demande')->where('id_enseignant',Auth::id())->get();
        return response()->json($offres);
    }

    // Envoyer une offre
    public function store(Request $request){
        $request->validate([
            'prix'=>'required|numeric|min:0',
            'message'=>'required|string|min:5',
            'id_demande'=>'required|exists:demandes,id_demande',
        ]);

        $demande = Demande::where('id_demande',$request->id_demande)->where('statut','active')->first();

        if (!$demande) {
            return response()->json([
                'message' =>'Demande introuvable ou expirée !'
            ], 404);
        }

        $offreExistante = Offre::where('id_demande', $request->id_demande)
                               ->where('id_enseignant', Auth::id())
                               ->first();

        if ($offreExistante) {
            return response()->json([
                'message' => 'Vous avez déjà envoyé une offre !'
            ], 400);
        }

        $offre = Offre::create([
            'prix'          => $request->prix,
            'message'       => $request->message,
            'statut'        => 'en_attente',
            'id_demande'    => $request->id_demande,
            'id_enseignant' => Auth::id(),
        ]);

        return response()->json([
            'message' => 'Offre envoyée avec succès !',
            'offre'   => $offre,
        ], 201);
    }

    // Accepter une offre 
    public function accepter($id)
    {
        $offre = Offre::find($id);

        if (!$offre) {
            return response()->json([
                'message' => 'Offre introuvable !'
            ], 404);
        }

        $demande = Demande::find($offre->id_demande);

        if (!$demande || $demande->id_utilisateur != Auth::id()) {
            return response()->json([
                'message' => 'Non autorisé !'
            ], 403);
        }

        $offre->update(['statut' => 'acceptee']);

        // Refuser toutes les autres offres
        Offre::where('id_demande', $offre->id_demande)
             ->where('id_offre', '!=', $id)
             ->update(['statut' => 'refusee']);

        Demande::where('id_demande', $offre->id_demande)
               ->update(['statut' => 'acceptee']);

        return response()->json([
            'message' => 'Offre acceptée avec succès !',
            'offre'   => $offre,
        ]);
    }

    // Refuser une offre
    public function refuser($id)
    {
        $offre = Offre::find($id);

        if (!$offre) {
            return response()->json([
                'message' => 'Offre introuvable !'
            ], 404);
        }

        $demande = Demande::find($offre->id_demande);

        if (!$demande || $demande->id_utilisateur != Auth::id()) {
            return response()->json([
                'message' => 'Non autorisé !'
            ], 403);
        }

        $offre->update(['statut' => 'refusee']);

        return response()->json([
            'message' => 'Offre refusée !',
            'offre'   => $offre,
        ]);
    }
}
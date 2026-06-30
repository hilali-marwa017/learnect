<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\Offre;
use App\Models\Demande;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class OffreController extends Controller
{
    // Offres d'une demande
    public function index($id_demande){
        $demande = Demande::find($id_demande);
        if (!$demande){
            return response()->json(['message' => 'Demande introuvable !'], 404);
        }
        $offres = Offre::with('enseignant.user')->where('id_demande', $id_demande)->get();
        return response()->json($offres);
    }

    // Mes offres (enseignant)
    public function mesOffres(){
        $offres = Offre::with('demande')->where('id_enseignant', Auth::id())->get();
        return response()->json($offres);
    }

    // Envoyer une offre (enseignant -> etudiant)
    public function store(Request $request){
        $request->validate([
            'prix'      => 'required|numeric|min:0',
            'message'   => 'required|string|min:5',
            'id_demande'=> 'required|exists:demandes,id_demande',
        ]);

        $demande = Demande::where('id_demande', $request->id_demande)
                          ->where('statut', 'active')
                          ->first();

        if (!$demande) {
            return response()->json(['message' => 'Demande introuvable ou expiree !'], 404);
        }

        // Verifier les offres dupliquees
        $offreExistante = Offre::where('id_demande', $request->id_demande)
                               ->where('id_enseignant', Auth::id())
                               ->first();
        if ($offreExistante) {
            return response()->json(['message' => 'Vous avez deja envoye une offre !'], 400);
        }

        // Recuperer les infos de l'enseignant connecte
        $enseignant = Auth::user();
        $nomComplet = $enseignant->prenom . ' ' . $enseignant->nom;

        // Recuperer le titre/matiere de l'enseignant
        $profilEnseignant = $enseignant->enseignant;
        $titre = $profilEnseignant ? $profilEnseignant->titre : 'Professeur';

        $offre = Offre::create([
            'prix'          => $request->prix,
            'message'       => $request->message,
            'statut'        => 'en_attente',
            'id_demande'    => $request->id_demande,
            'id_enseignant' => Auth::id(),
        ]);

        // NOTIFICATION : Etudiant notifie avec nom + titre du prof
        Notification::create([
            'type'          => 'offre',
            'contenu'       => $nomComplet . ' (' . $titre . ') vous a envoye une offre de ' . $request->prix . ' DH pour votre demande.',
            'est_lue'       => false,
            'utilisateur_id'=> $demande->id_utilisateur,
        ]);

        return response()->json([
            'message' => 'Offre envoyee avec succes !',
            'offre'   => $offre,
        ], 201);
    }

    // Accepter une offre (etudiant -> enseignant)
    public function accepter($id){
        $offre = Offre::with('enseignant.user')->find($id);
        if (!$offre){
            return response()->json(['message' => 'Offre introuvable !'], 404);
        }

        $demande = Demande::find($offre->id_demande);
        if (!$demande || $demande->id_utilisateur != Auth::id()) {
            return response()->json(['message' => 'Non autorise !'], 403);
        }

        $offre->update(['statut' => 'acceptee']);

        // Refuser toutes les autres offres
        Offre::where('id_demande', $offre->id_demande)
             ->where('id_offre', '!=', $id)
             ->update(['statut' => 'refusee']);

        // Marquer la demande comme acceptee
        Demande::where('id_demande', $offre->id_demande)
               ->update(['statut' => 'acceptee']);

        // Recuperer nom etudiant
        $etudiant = Auth::user();
        $nomEtudiant = $etudiant->prenom . ' ' . $etudiant->nom;

        // NOTIFICATION : Enseignant notifie que son offre est acceptee avec nom etudiant
        Notification::create([
            'type'          => 'offre',
            'contenu'       => $nomEtudiant . ' a accepte votre offre de ' . $offre->prix . ' DH. Une reservation va etre creee.',
            'est_lue'       => false,
            'utilisateur_id'=> $offre->id_enseignant,
        ]);

        // NOTIFICATION : Etudiant confirme avec nom prof
        $nomProf = $offre->enseignant->user->prenom . ' ' . $offre->enseignant->user->nom;
        $titreProf = $offre->enseignant->titre ?? 'Professeur';

        Notification::create([
            'type'          => 'offre',
            'contenu'       => 'Vous avez accepte l offre de ' . $nomProf . ' (' . $titreProf . ') pour ' . $offre->prix . ' DH. Vous pouvez maintenant reserver un creneau.',
            'est_lue'       => false,
            'utilisateur_id'=> Auth::id(),
        ]);

        return response()->json([
            'message' => 'Offre acceptee avec succes !',
            'offre'   => $offre,
        ]);
    }

    // Refuser une offre (etudiant -> enseignant)
    public function refuser($id){
        $offre = Offre::with('enseignant.user')->find($id);
        if (!$offre){
            return response()->json(['message' => 'Offre introuvable !'], 404);
        }

        $demande = Demande::find($offre->id_demande);
        if (!$demande || $demande->id_utilisateur != Auth::id()){
            return response()->json(['message' => 'Non autorise !'], 403);
        }

        $offre->update(['statut' => 'refusee']);

        // Recuperer nom etudiant
        $nomEtudiant = Auth::user()->prenom . ' ' . Auth::user()->nom;

        // NOTIFICATION : Enseignant notifie que son offre est refusee avec nom etudiant
        Notification::create([
            'type'          => 'offre',
            'contenu'       => $nomEtudiant . ' a refuse votre offre de ' . $offre->prix . ' DH.',
            'est_lue'       => false,
            'utilisateur_id'=> $offre->id_enseignant,
        ]);

        return response()->json([
            'message' => 'Offre refusee !',
            'offre'   => $offre,
        ]);
    }
}
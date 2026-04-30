<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\Creneau;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CreneauController extends Controller
{
    public function index($id){
        $creneaux = Creneau::where('id_enseignant',$id)->get(); //retourne la liste des creneaux 
        return response()->json($creneaux);
    }

    // creer un creneau
    public function store(Request $request){
        //validation
        $request->validate([
            'jour'=>'required|in:lundi,mardi,mercredi,jeudi,vendredi,samedi,dimanche',
            'heureDebut'=>'required|date_format:H:i',
            'heureFin'=>'required|date_format:H:i|after:heureDebut',
        ]);

        // Creer le creneau pour l'enseignant connecte
        $creneau = Creneau::create([
            'jour'=>$request->jour,
            'heureDebut'=>$request->heureDebut,
            'heureFin'=>$request->heureFin,
            'estDisponible'=>true, // disponible par defaut
            'id_enseignant'=>Auth::id(),
        ]);

        return response()->json([
            'message'=>'Créneau créé avec succès !',
            'creneau'=>$creneau,
        ], 201);
    }

     // Modifier un creneau
    public function update(Request $request, $id){
        $request->validate([
            'jour'=>'in:lundi,mardi,mercredi,jeudi,vendredi,samedi,dimanche',
            'heureDebut'=>'date_format:H:i',
            'heureFin'=>'date_format:H:i',
        ]);
        // Cherche le creneau appartenant a l'enseignant connecte
        $creneau = Creneau::where('id_creneau',$id)->where('id_enseignant',Auth::id())->first();

        if(!$creneau){
            return response()->json([
                'message'=>'Créneau introuvable !'
            ],404);
        }

        $creneau->update-

    }
}

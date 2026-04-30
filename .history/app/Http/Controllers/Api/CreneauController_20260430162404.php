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
            'id_enseignant' => Auth::id(),

        ]);
    }
}

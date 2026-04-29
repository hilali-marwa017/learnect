<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class EtudiantController extends Controller
{
    // profil etudiant connecte
    public function show(){
        $etudiant = Etudiant::with('user')->where('utilisateur_id',Auth::id())->first();

    }
}
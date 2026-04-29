<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\

class EtudiantController extends Controller
{
    // profil etudiant connecte
    public function show(){
        $etudiant = Etudiant::with('user')->where('utilisateur_id',Auth::id())->first();

    }
}
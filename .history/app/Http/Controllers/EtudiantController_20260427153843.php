<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Etudiant;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;



class EtudiantController extends Controller
{
    // profil etudiant connecte
    public function show(){
        $etudiant = Etudiant::with('user')->where('utilisateur_id',Auth::id())->first();

        if('!$etu')

    }
}
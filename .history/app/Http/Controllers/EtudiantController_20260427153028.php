<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class EtudiantController extends Controller
{
    public function show(){
        $etudiant = Etudiant::with('user')->where('utilisateur_id',Auth::id())

    }

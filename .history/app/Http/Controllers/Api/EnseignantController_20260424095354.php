<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Enseignant; //pour acceder a la table enseignant
use App\Models\User;//pour acceder a la table users
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;

class EnseignantController extends Controller
{
    //liste des enseignants
    public function index(Request $request){
        // Démarre une requête sur la table enseignants
        $query = Enseignant::query();
 
    }

    
}

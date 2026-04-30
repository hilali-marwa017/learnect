<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\Creneau;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CreneauController extends Controller
{
    public function index($id){
        $creneaux = Creneau::where('id_enseignant') 

    }
}

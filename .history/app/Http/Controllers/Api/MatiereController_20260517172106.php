<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Matiere;

class MatiereController extends Controller
{    public function index(){
        $matieres = Matiere::orderBy('categorie')->get();
        return response()->json($matieres);
    }
}
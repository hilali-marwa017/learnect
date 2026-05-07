<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Message;
use App\Models\Reservation;
use Illuminate\Support\Facades\Auth;

class MessageController extends Controller
{
    public function mesConversations(){
        $reservations = Reservation::with(['creneau.enseignant.user','etudiant','messages.expediteur'])->where('statut','confirmee')->where('id_utilisateur',Auth::id())->get();
        return response()->json($reservations);
    }

    public function index(){

    }
}

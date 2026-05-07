<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    public function mesConversations(){
        $reservations = Reservation::with(['creneau.enseignant.user','etudiant','messages.expediteur'])->where('statut','confirmee')->where('id_utilisateur')
    }
}

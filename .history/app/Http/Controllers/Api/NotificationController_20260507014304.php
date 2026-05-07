<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\Notification;
use Illuminate\Support\Facades\Auth;

class NotificationController extends Controller
{
    public function index(){
        // recuperer toutes les notif de user connectee
        $notifications = Notification::where('utilisateur_id', Auth::id())->orderBy('created_at','desc')->get();

        return response()->json($notifications);
    }

    public function unread(){
        // compter les notif non lues de user connectee
        $count = Notification::where('utilisateur_id', Auth::id())->where('est_lue',false)->count();

        return response()->json(['count'=>$count]);
    }

    public function markRead($id){
        // chercher une notig spécifique de user connectee
        $notif = Notification::where('id_notification',$id)->where('utilisateur_id',Auth::id())->first();

        if (!$notif) {
            return response()->json([
                'message'=>'Notification introuvable !'
                ],404);
        }

        // marquer la notif comme lue
        $notif->update(['est_lue' => true]);

        return response()->json(['message'=>'Notification marquée comme lue !']);
    }

    public function markAllRead(){
        // marquer toutes les notif non lues comme lues d'un user connectee
        Notification::where('utilisateur_id', Auth::id())->where('est_lue', false ->update(['est_lue' => true]);

        return response()->json(['message' => 'Toutes les notifications marquées comme lues !']);
    }
}
<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    use HasFactory;

    protected $primaryKey = 'id_message';
    protected $fillable = ['contenu','id_expediteur','id_destinataire','id_reservation'];

    // Appartient a un expéditeur
    public function expediteur(){
        return $this->belongsTo(User::class, 'id_expediteur', 'utilisateur_id');
    }

    // Appartient à un destinataire
    public function destinataire()
    {
        return $this->belongsTo(User::class, 'id_destinataire', 'utilisateur_id');
    }

    // Appartient à une réservation
    public function reservation()
    {
        return $this->belongsTo(Reservation::class, 'id_reservation', 'id_reservation');
    }
}
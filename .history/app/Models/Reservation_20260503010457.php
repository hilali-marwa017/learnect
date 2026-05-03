<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reservation extends Model
{
    use HasFactory;

    protected $primaryKey = 'id_reservation';
    protected $fillable = ['date','montant','statut','id_utilisateur','id_creneau','id_offre'];

    // Appartient a un etudiant
    public function etudiant(){
        return $this->belongsTo(User::class, 'id_utilisateur', 'utilisateur_id');
    }

    // Appartient a un creneau
    public function creneau(){
        return $this->belongsTo(Creneau::class,'id_creneau', 'id_creneau');
    }

    // Appartient a une offre
    public function offre(){
        return $this->belongsTo(Offre::class, 'id_offre', 'id_offre');
    }

    // A un paiement
    public function paiement(){
        return $this->hasOne(Paiement::class, 'id_reservation', 'id_reservation');
    }

    // A plusieurs messages
    public function messages(){
        return $this->hasMany(Message::class, 'id_reservation', 'id_reservation');
    }

    // A un avis
    public function avis(){
        return $this->hasOne(Avis::class, 'id_reservation', 'id_reservation');
    }
}
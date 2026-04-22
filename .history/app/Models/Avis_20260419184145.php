<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Avis extends Model
{
    use HasFactory;

    protected $primaryKey = 'id_avis';
    protected $fillable = ['note','commentaire','id_utilisateur','id_enseignant','id_reservation'];

    // Appartient a un étudiant
    public function etudiant(){
        return $this->belongsTo(User::class, 'id_utilisateur', 'utilisateur_id');
    }

    // Appartient a un enseignant
    public function enseignant(){
        return $this->belongsTo(Enseignant::class, 'id_enseignant', 'utilisateur_id');
    }

    // Appartient a une reservation
    public function reservation(){
        return $this->belongsTo(Reservation::class, 'id_reservation', 'id_reservation');
    }

    // A plusieurs signalements
    public function signalements()
    {
        return $this->hasMany(Signalement::class, 'id_avis', 'id_avis');
    }
}
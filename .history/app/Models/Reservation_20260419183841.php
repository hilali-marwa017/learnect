<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reservation extends Model
{
    use HasFactory;

    protected $primaryKey = 'id_reservation';

    protected $fillable = [
        'date',
        'montant',
        'statut','id_utilisateur','id_creneau','id_offre'];

    // Appartient à un étudiant
    public function etudiant()
    {
        return $this->belongsTo(User::class, 'id_utilisateur', 'utilisateur_id');
    }

    // Appartient à un créneau
    public function creneau()
    {
        return $this->belongsTo(Creneau::class, 'id_creneau', 'id_creneau');
    }

    // Appartient à une offre
    public function offre()
    {
        return $this->belongsTo(Offre::class, 'id_offre', 'id_offre');
    }

    // A un paiement
    public function paiement()
    {
        return $this->hasOne(Paiement::class, 'id_reservation', 'id_reservation');
    }

    // A plusieurs messages
    public function messages()
    {
        return $this->hasMany(Message::class, 'id_reservation', 'id_reservation');
    }

    // A un avis
    public function avis()
    {
        return $this->hasOne(Avis::class, 'id_reservation', 'id_reservation');
    }
}
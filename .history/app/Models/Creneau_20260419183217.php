<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Creneau extends Model
{
    use HasFactory;

    protected $primaryKey = 'id_creneau';

    protected $fillable = [
        'jour',
        'heureDebut',
        'heureFin',
        'estDisponible',
        'id_enseignant',
    ];

    // Appartient a un enseignant
    public function enseignant()
    {
        return $this->belongsTo(Enseignant::class, 'id_enseignant', 'utilisateur_id');
    }

    // A plusieurs reservations
    public function reservations(){
        return $this->hasMany(Reservation::class, 'id_creneau', 'id_creneau');
    }
}
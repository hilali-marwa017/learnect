<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Etudiant extends Model
{
    use HasFactory;

    protected $primaryKey = 'utilisateur_id';
    public $incrementing = false;

    protected $fillable = [
        'utilisateur_id',
        'niveau',
        'budget',
    ];

    // Appartient à un user
    public function user()
    {
        return $this->belongsTo(User::class, 'utilisateur_id', 'utilisateur_id');
    }

    // A plusieurs réservations
    public function reservations()
    {
        return $this->hasMany(Reservation::class, 'id_utilisateur', 'utilisateur_id');
    }

    // A plusieurs demandes
    public function demandes()
    {
        return $this->hasMany(Demande::class, 'id_utilisateur', 'utilisateur_id');
    }

    // A plusieurs avis
    public function evis()
    {
        return $this->hasMany(Avis::class, 'id_utilisateur', 'utilisateur_id');
    }
}
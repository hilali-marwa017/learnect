<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Paiement extends Model
{
    use HasFactory;

    protected $primaryKey = 'id_paiement';
    protected $fillable = [
        'montantTotal',
        'comission',
        'montantEnseignant',
        'methode',
        'statut',
        'id_reservation'
    ];

    // Appartient a une reservation
    public function reservation()
    {
        return $this->belongsTo(Reservation::class, 'id_reservation', 'id_reservation');
    }
}
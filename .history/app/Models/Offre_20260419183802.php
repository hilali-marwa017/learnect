<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Offre extends Model
{
    use HasFactory;

    protected $primaryKey = 'id_offre';
    protected $fillable = ['prix','message','statut','dateCreation','id_demande','id_enseignant'];

    // Appartient a une demande
    public function demande(){
        return $this->belongsTo(Demande::class, 'id_demande', 'id_demande');
    }

    // Appartient a un enseignant
    public function enseignant(){
        return $this->belongsTo(Enseignant::class, 'id_enseignant', 'utilisateur_id');
    }

    // A une reservation
    public function reservation(){
        return $this->hasOne(Reservation::class, 'id_offre', 'id_offre');
    }
}
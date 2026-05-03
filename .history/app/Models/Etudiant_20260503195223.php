<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Etudiant extends Model
{
    use HasFactory;

    protected $primaryKey = 'utilisateur_id';
    public $incrementing  = false; // ✅ ajoute ça
    protected $fillable = ['utilisateur_id','niveau','budget'];

    // Appartient a un user
    public function user(){
        return $this->belongsTo(User::class,'utilisateur_id','utilisateur_id');
    }

    // A plusieurs reservations
    public function reservations(){
        return $this->hasMany(Reservation::class,'id_utilisateur','utilisateur_id');
    }

    // A plusieurs demandes
    public function demandes(){
        return $this->hasMany(Demande::class,'id_utilisateur','utilisateur_id');
    }

    // A plusieurs avis
    public function avis(){
        return $this->hasMany(Avis::class,'id_utilisateur','utilisateur_id');
    }
}
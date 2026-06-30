<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Demande extends Model
{
    use HasFactory;

    protected $primaryKey = 'id_demande';

    protected $fillable = ['matiere','niveau','budgetMin','budgetMax','ville','message',statut','expire_at','id_utilisateur'];

    // Appartient a un etudiant
    public function etudiant(){
        return $this->belongsTo(User::class,'id_utilisateur', 'utilisateur_id');
    }

    // A plusieurs offres
    public function offres(){
        return $this->hasMany(Offre::class,'id_demande', 'id_demande');
    }
}
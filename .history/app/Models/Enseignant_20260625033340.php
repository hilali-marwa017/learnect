<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Enseignant extends Model
{
    use HasFactory;

    protected $primaryKey = 'utilisateur_id';
    public $incrementing  = false; //FK pas AutoIncrement
    protected $fillable = ['utilisateur_id','cin_recto','cin_verso','diplome','titre','description_cours','description_profil','cours_domicile','cours_deplacement','cours_enligne','distance_max','langues','tarifHeure','estVerifie','noteMoyenne','statut_annonce'];

    // Dans App/Models/Enseignant.php — ajoute cette méthode
public function getRouteKeyName()
{
    return 'utilisateur_id';
}
    // Appartient a un user
    public function user(){
        return $this->belongsTo(User::class,'utilisateur_id','utilisateur_id');
    }

    // Plusieurs matieres (many to many)
    public function matieres(){
        return $this->belongsToMany(Matiere::class,'enseigners','id_enseignant','id_matiere')->withPivot('niveau')->withTimestamps();//created_at, updated_at
    }

    // A plusieurs creneaux
    public function creneaux(){
        return $this->hasMany(Creneau::class,'id_enseignant','utilisateur_id');
    }

    // A plusieurs documents
    public function documents(){
        return $this->hasMany(Document::class,'id_enseignant', 'utilisateur_id');
    }

    // A plusieurs offres
    public function offres(){
        return $this->hasMany(Offre::class, 'id_enseignant', 'utilisateur_id');
    }

    // A plusieurs avis
    public function avis(){
        return $this->hasMany(Avis::class, 'id_enseignant', 'utilisateur_id');
    }
}
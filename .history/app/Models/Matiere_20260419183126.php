<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Matiere extends Model
{
    use HasFactory;

    protected $primaryKey = 'id_matiere';

    protected $fillable = ['nom', 'categorie'];

    // Plusieurs enseignants (many to many)
    public function enseignants()
    {
        return $this->belongsToMany(Enseignant::class,'enseigners','id_matiere','id_enseignant')->withPivot('niveau')->withTimestamps();
    }
}
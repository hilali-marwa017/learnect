<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Document extends Model
{
    use HasFactory;

    protected $primaryKey = 'id_document';

    protected $fillable = [
        'type',
        'chemin_fichier',
        'statut',
        'commentaire_admin',
        'id_enseignant',
    ];

    // Appartient à un enseignant
    public function enseignant()
    {
        return $this->belongsTo(Enseignant::class, 'id_enseignant', 'utilisateur_id');
    }
}
<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Signalement extends Model
{
    use HasFactory;

    protected $primaryKey = 'id_signalement';
    protected $fillable = ['motif','statut','id_avis','id_signaleur'];

    // Appartient à un avis
    public function avis()
    {
        return $this->belongsTo(Avis::class, 'id_avis', 'id_avis');
    }

    // Appartient à un signaleur
    public function signaleur()
    {
        return $this->belongsTo(User::class, 'id_signaleur', 'utilisateur_id');
    }
}
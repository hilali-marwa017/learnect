<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    use HasFactory;

    protected $primaryKey = 'id_notification';

    protected $fillable = [
        'type',
        'contenu','est_lue','utilisateur_id'];

    // Appartient a un user
    public function user(){
        return $this->belongsTo(User::class, 'utilisateur_id', 'utilisateur_id');
    }
}
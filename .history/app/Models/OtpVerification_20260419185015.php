<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OtpVerification extends Model
{
    use HasFactory;

    protected $primaryKey = 'id_otp';
    protected $fillable = ['telephone','code','expire_at','est_utilise','type','id_utilisateur'];

    // Appartient à un user
    public function user()
    {
        return $this->belongsTo(User::class, 'id_utilisateur', 'utilisateur_id');
    }
}
<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasApiTokens;

    protected $primaryKey = 'utilisateur_id';

    protected $fillable = ['nom','prenom','email','password','telephone','ville','photo','role','statut','can_teach','can_learn'];

    protected $hidden = ['password'];

    protected function casts(): array{
        return ['password'=>'hashed'];
    }

    // 1,1 
    public function etudiant(){
        return $this->hasOne(Etudiant::class, 'utilisateur_id', 'utilisateur_id');
    }

    // 1,1 
    public function enseignant(){
        return $this->hasOne(Enseignant::class, 'utilisateur_id', 'utilisateur_id');
    }

    // 0,n 
    public function mesNotifications(){
        return $this->hasMany(Notification::class, 'utilisateur_id', 'utilisateur_id');
    }

    // 0,n 
    public function messages(){
        return $this->hasMany(Message::class,'id_expediteur','utilisateur_id');
    }

    // 0,n 
    public function otpVerifications(){
        return $this->hasMany(OtpVerification::class,'id_utilisateur','utilisateur_id');
    }

    // 0,n messages reçus
    public function messagesRecus(){
        return $this->hasMany(Message::class,'id_destinataire','utilisateur_id');
    }

    // 0,n
    public function demandes(){
        return $this->hasMany(Demande::class,'id_utilisateur','utilisateur_id');
    }

    // 0,n
    public function reservations(){
        return $this->hasMany(Reservation::class,'id_utilisateur','utilisateur_id');
    }
}
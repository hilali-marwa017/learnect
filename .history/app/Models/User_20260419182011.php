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

    protected $fillable = [
        'nom',
        'prenom',
        'email',
        'password',
        'telephone',
        'ville',
        'photo',
        'role',
        'statut'];

    protected $hidden = ['password'];

    protected function casts(): array
    {
        return ['password' => 'hashed'];
    }

    // Un user a un etudiant
    public function etudiant()
    {
        return $this->hasOne(Etudiant::class, 'utilisateur_id', 'utilisateur_id');
    }

    // Un user a un enseignant
    public function enseignant()
    {
        return $this->hasOne(Enseignant::class, 'utilisateur_id', 'utilisateur_id');
    }

    // Un user a plusieurs notifications
    public function notifications()
    {
        return $this->hasMany(Notification::class, 'utilisateur_id', 'utilisateur_id');
    }

    // Un user a plusieurs messages envoyés
    public function messages()
    {
        return $this->hasMany(Message::class, 'id_expediteur', 'utilisateur_id');
    }
}
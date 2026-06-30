<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ville extends Model
{
    use HasFactory;

    protected $primaryKey = 'id_ville';
    protected $fillable = ['nom', 'region', 'est_active'];

    public function users()
    {
        return $this->hasMany(User::class, 'ville', 'nom');
    }
}
<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    public function run()
    {
        // Supprimer l'ancien admin
        DB::table('users')->where('email', 'admin@learnect.ma')->delete();
        
        // Créer le nouvel admin
        DB::table('users')->insert([
            'nom' => 'Admin',
            'prenom' => 'Super',
            'email' => 'admin@learnect.ma',
            'password' => Hash::make('Admin2024!'),
            'telephone' => '0699999999',
            'ville' => 'Casablanca',
            'role' => 'admin',
            'statut' => 'actif',
            'can_teach' => false,
            'can_learn' => false,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        
        $this->command->info('Admin créé !');
    }
}
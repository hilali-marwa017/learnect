<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('users')->insert([
            [
                'nom' => 'Admin',
                'prenom' => 'System',
                'email' => 'admin@learnect.ma',
                'password' => Hash::make('admin123'),
                'telephone' => '+212600000001',
                'ville' => 'Casablanca',
                'role' => 'admin',
                'statut' => 'actif',
                'can_teach' => false,
                'can_learn' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nom' => 'Benani',
                'prenom' => 'Marwa',
                'email' => 'etudiant@learnect.ma',
                'password' => Hash::make('etudiant123'),
                'telephone' => '+212600000002',
                'ville' => 'Rabat',
                'role' => 'etudiant',
                'statut' => 'actif',
                'can_teach' => false,
                'can_learn' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nom' => 'Amrani',
                'prenom' => 'Karim',
                'email' => 'enseignant@learnect.ma',
                'password' => 'enseignant123'),
                'telephone' => '+212600000003',
                'ville' => 'Casablanca',
                'role' => 'enseignant',
                'statut' => 'actif',
                'can_teach' => true,
                'can_learn' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
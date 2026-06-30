<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class CreateAdminSeeder extends Seeder
{
    public function run()
    {
        $admin = DB::table('users')->where('email', 'admin@learnect.ma')->first();
        
        if (!$admin) {
            DB::table('users')->insert([
                'nom' => 'Admin',
                'prenom' => 'Super',
                'email' => 'admin@learnect.ma',
                'password' => Hash::make('admin123'),
                'telephone' => '0612345678',
                'ville' => 'Casablanca',
                'role' => 'admin',
                'statut' => 'actif',
                'can_teach' => false,
                'can_learn' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
            $this->command->info('Admin créé avec succès !');
        } else {
            $this->command->info('Admin existe déjà !');
        }
    }
}
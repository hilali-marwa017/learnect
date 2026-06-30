// database/seeders/AdminSeeder.php
<?php


use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run()
    {
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
    }
}
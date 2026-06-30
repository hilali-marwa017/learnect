<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class VilleSeeder extends Seeder
{
    public function run(): void
    {
        $villes = [
            ['nom' => 'Casablanca', 'region' => 'Casablanca-Settat'],
            ['nom' => 'Rabat', 'region' => 'Rabat-Salé-Kénitra'],
            ['nom' => 'Marrakech', 'region' => 'Marrakech-Safi'],
            ['nom' => 'Tanger', 'region' => 'Tanger-Tétouan-Al Hoceïma'],
            ['nom' => 'Fès', 'region' => 'Fès-Meknès'],
            ['nom' => 'Agadir', 'region' => 'Souss-Massa'],
            ['nom' => 'Meknès', 'region' => 'Fès-Meknès'],
            ['nom' => 'Oujda', 'region' => 'Oriental'],
            ['nom' => 'Kénitra', 'region' => 'Rabat-Salé-Kénitra'],
            ['nom' => 'Tétouan', 'region' => 'Tanger-Tétouan-Al Hoceïma'],
            ['nom' => 'Salé', 'region' => 'Rabat-Salé-Kénitra'],
            ['nom' => 'Temara', 'region' => 'Rabat-Salé-Kénitra'],
            ['nom' => 'El Jadida', 'region' => 'Casablanca-Settat'],
            ['nom' => 'Safi', 'region' => 'Marrakech-Safi'],
            ['nom' => 'Mohammedia', 'region' => 'Casablanca-Settat'],
            ['nom' => 'Laâyoune', 'region' => 'Laâyoune-Sakia El Hamra'],
            ['nom' => 'Dakhla', 'region' => 'Dakhla-Oued Ed-Dahab'],
            ['nom' => 'En ligne', 'region' => 'Webcam'],
            ['nom' => 'Autour de moi', 'region' => 'Géolocalisation'],
        ];

        DB::table('villes')->insert($villes);
    }
}
<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class VilleSeeder extends Seeder
{
    public function run(): void
    {
        // Désactiver les contraintes
        DB::statement('SET FOREIGN_KEY_CHECKS=0');
        
        // Vider la table
        DB::table('villes')->truncate();
        
        // Réactiver les contraintes
        DB::statement('SET FOREIGN_KEY_CHECKS=1');

        $villes = [
            ['nom' => 'Casablanca', 'region' => 'Casablanca-Settat'],
            ['nom' => 'Mohammedia', 'region' => 'Casablanca-Settat'],
            ['nom' => 'El Jadida', 'region' => 'Casablanca-Settat'],
            ['nom' => 'Settat', 'region' => 'Casablanca-Settat'],
            ['nom' => 'Berrechid', 'region' => 'Casablanca-Settat'],
            ['nom' => 'Bouskoura', 'region' => 'Casablanca-Settat'],
            ['nom' => 'Azemmour', 'region' => 'Casablanca-Settat'],
            ['nom' => 'Rabat', 'region' => 'Rabat-Salé-Kénitra'],
            ['nom' => 'Salé', 'region' => 'Rabat-Salé-Kénitra'],
            ['nom' => 'Temara', 'region' => 'Rabat-Salé-Kénitra'],
            ['nom' => 'Kénitra', 'region' => 'Rabat-Salé-Kénitra'],
            ['nom' => 'Skhirate', 'region' => 'Rabat-Salé-Kénitra'],
            ['nom' => 'Sidi Slimane', 'region' => 'Rabat-Salé-Kénitra'],
            ['nom' => 'Sidi Kacem', 'region' => 'Rabat-Salé-Kénitra'],
            ['nom' => 'Marrakech', 'region' => 'Marrakech-Safi'],
            ['nom' => 'Safi', 'region' => 'Marrakech-Safi'],
            ['nom' => 'Essaouira', 'region' => 'Marrakech-Safi'],
            ['nom' => 'Chichaoua', 'region' => 'Marrakech-Safi'],
            ['nom' => 'Kelâat M\'Gouna', 'region' => 'Marrakech-Safi'],
            ['nom' => 'Youssoufia', 'region' => 'Marrakech-Safi'],
            ['nom' => 'Tanger', 'region' => 'Tanger-Tétouan-Al Hoceïma'],
            ['nom' => 'Tétouan', 'region' => 'Tanger-Tétouan-Al Hoceïma'],
            ['nom' => 'Al Hoceïma', 'region' => 'Tanger-Tétouan-Al Hoceïma'],
            ['nom' => 'Larache', 'region' => 'Tanger-Tétouan-Al Hoceïma'],
            ['nom' => 'Chefchaouen', 'region' => 'Tanger-Tétouan-Al Hoceïma'],
            ['nom' => 'Fnideq', 'region' => 'Tanger-Tétouan-Al Hoceïma'],
            ['nom' => 'Martil', 'region' => 'Tanger-Tétouan-Al Hoceïma'],
            ['nom' => 'Fès', 'region' => 'Fès-Meknès'],
            ['nom' => 'Meknès', 'region' => 'Fès-Meknès'],
            ['nom' => 'Ifrane', 'region' => 'Fès-Meknès'],
            ['nom' => 'Azrou', 'region' => 'Fès-Meknès'],
            ['nom' => 'Sefrou', 'region' => 'Fès-Meknès'],
            ['nom' => 'El Hajeb', 'region' => 'Fès-Meknès'],
            ['nom' => 'Taza', 'region' => 'Fès-Meknès'],
            ['nom' => 'Agadir', 'region' => 'Souss-Massa'],
            ['nom' => 'Taroudant', 'region' => 'Souss-Massa'],
            ['nom' => 'Inezgane', 'region' => 'Souss-Massa'],
            ['nom' => 'Aït Melloul', 'region' => 'Souss-Massa'],
            ['nom' => 'Tiznit', 'region' => 'Souss-Massa'],
            ['nom' => 'Oulad Teïma', 'region' => 'Souss-Massa'],
            ['nom' => 'Oujda', 'region' => 'Oriental'],
            ['nom' => 'Nador', 'region' => 'Oriental'],
            ['nom' => 'Berkane', 'region' => 'Oriental'],
            ['nom' => 'Taourirt', 'region' => 'Oriental'],
            ['nom' => 'Jerada', 'region' => 'Oriental'],
            ['nom' => 'Figuig', 'region' => 'Oriental'],
            ['nom' => 'Béni Mellal', 'region' => 'Béni Mellal-Khénifra'],
            ['nom' => 'Khouribga', 'region' => 'Béni Mellal-Khénifra'],
            ['nom' => 'Fquih Ben Salah', 'region' => 'Béni Mellal-Khénifra'],
            ['nom' => 'Kasba Tadla', 'region' => 'Béni Mellal-Khénifra'],
            ['nom' => 'Oued Zem', 'region' => 'Béni Mellal-Khénifra'],
            ['nom' => 'Errachidia', 'region' => 'Drâa-Tafilalet'],
            ['nom' => 'Ouarzazate', 'region' => 'Drâa-Tafilalet'],
            ['nom' => 'Zagora', 'region' => 'Drâa-Tafilalet'],
            ['nom' => 'Tinghir', 'region' => 'Drâa-Tafilalet'],
            ['nom' => 'Midelt', 'region' => 'Drâa-Tafilalet'],
            ['nom' => 'Laâyoune', 'region' => 'Laâyoune-Sakia El Hamra'],
            ['nom' => 'Boujdour', 'region' => 'Laâyoune-Sakia El Hamra'],
            ['nom' => 'Tarfaya', 'region' => 'Laâyoune-Sakia El Hamra'],
            ['nom' => 'Dakhla', 'region' => 'Dakhla-Oued Ed-Dahab'],
            ['nom' => 'Guelmim', 'region' => 'Guelmim-Oued Noun'],
            ['nom' => 'Tan-Tan', 'region' => 'Guelmim-Oued Noun'],
            ['nom' => 'Sidi Ifni', 'region' => 'Guelmim-Oued Noun'],
            ['nom' => 'Khemisset', 'region' => 'Rabat-Salé-Kénitra'],
            ['nom' => 'Ouazzane', 'region' => 'Tanger-Tétouan-Al Hoceïma'],
            ['nom' => 'Sidi Bennour', 'region' => 'Casablanca-Settat'],
            ['nom' => 'Ahfir', 'region' => 'Oriental'],
            ['nom' => 'Guercif', 'region' => 'Oriental'],
            ['nom' => 'Missour', 'region' => 'Fès-Meknès'],
        ];

        // Insertion directe
        DB::table('villes')->insert($villes);
    }
}
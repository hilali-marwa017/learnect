<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MatiereSeeder extends Seeder
{
    public function run(): void
    {
        // Vider la table avant d'insérer
        DB::table('matieres')->truncate();

        $matieres = [
            // ============================================================
            // UNIQUEMENT LES LANGUES
            // ============================================================
            ['nom' => 'Français', 'categorie' => 'Langues'],
            ['nom' => 'Anglais', 'categorie' => 'Langues'],
            ['nom' => 'Arabe', 'categorie' => 'Langues'],
            ['nom' => 'Espagnol', 'categorie' => 'Langues'],
            ['nom' => 'Allemand', 'categorie' => 'Langues'],
            ['nom' => 'Italien', 'categorie' => 'Langues'],
            ['nom' => 'Russe', 'categorie' => 'Langues'],
            ['nom' => 'Chinois', 'categorie' => 'Langues'],
            ['nom' => 'Japonais', 'categorie' => 'Langues'],
            ['nom' => 'Coréen', 'categorie' => 'Langues'],
            ['nom' => 'Portugais', 'categorie' => 'Langues'],
            ['nom' => 'Néerlandais', 'categorie' => 'Langues'],
            ['nom' => 'Turc', 'categorie' => 'Langues'],
            ['nom' => 'Hébreu', 'categorie' => 'Langues'],
            ['nom' => 'Latin', 'categorie' => 'Langues'],
            ['nom' => 'Grec', 'categorie' => 'Langues'],
            ['nom' => 'Hindi', 'categorie' => 'Langues'],
            ['nom' => 'Persan', 'categorie' => 'Langues'],
            ['nom' => 'Ourdou', 'categorie' => 'Langues'],
            ['nom' => 'Bengali', 'categorie' => 'Langues'],
            ['nom' => 'Swahili', 'categorie' => 'Langues'],
            ['nom' => 'Vietnamien', 'categorie' => 'Langues'],
            ['nom' => 'Thaï', 'categorie' => 'Langues'],
            ['nom' => 'Indonésien', 'categorie' => 'Langues'],
            ['nom' => 'Malais', 'categorie' => 'Langues'],
            ['nom' => 'Tagalog', 'categorie' => 'Langues'],
            ['nom' => 'Birman', 'categorie' => 'Langues'],
            ['nom' => 'Khmer', 'categorie' => 'Langues'],
            ['nom' => 'Népalais', 'categorie' => 'Langues'],
            ['nom' => 'Cingalais', 'categorie' => 'Langues'],
            ['nom' => 'Mongol', 'categorie' => 'Langues'],
            ['nom' => 'Arménien', 'categorie' => 'Langues'],
            ['nom' => 'Géorgien', 'categorie' => 'Langues'],
            ['nom' => 'Albanais', 'categorie' => 'Langues'],
            ['nom' => 'Serbe', 'categorie' => 'Langues'],
            ['nom' => 'Croate', 'categorie' => 'Langues'],
            ['nom' => 'Bosniaque', 'categorie' => 'Langues'],
            ['nom' => 'Slovène', 'categorie' => 'Langues'],
            ['nom' => 'Macédonien', 'categorie' => 'Langues'],
            ['nom' => 'Bulgare', 'categorie' => 'Langues'],
            ['nom' => 'Roumain', 'categorie' => 'Langues'],
            ['nom' => 'Hongrois', 'categorie' => 'Langues'],
            ['nom' => 'Polonais', 'categorie' => 'Langues'],
            ['nom' => 'Tchèque', 'categorie' => 'Langues'],
            ['nom' => 'Slovaque', 'categorie' => 'Langues'],
            ['nom' => 'Letton', 'categorie' => 'Langues'],
            ['nom' => 'Lituanien', 'categorie' => 'Langues'],
            ['nom' => 'Estonien', 'categorie' => 'Langues'],
            ['nom' => 'Finnois', 'categorie' => 'Langues'],
            ['nom' => 'Suédois', 'categorie' => 'Langues'],
            ['nom' => 'Norvégien', 'categorie' => 'Langues'],
            ['nom' => 'Danois', 'categorie' => 'Langues'],
            ['nom' => 'Islandais', 'categorie' => 'Langues'],
            ['nom' => 'Irlandais', 'categorie' => 'Langues'],
            ['nom' => 'Gallois', 'categorie' => 'Langues'],
            ['nom' => 'Breton', 'categorie' => 'Langues'],
            ['nom' => 'Basque', 'categorie' => 'Langues'],
            ['nom' => 'Catalan', 'categorie' => 'Langues'],
            ['nom' => 'Galicien', 'categorie' => 'Langues'],
            ['nom' => 'Occitan', 'categorie' => 'Langues'],
            ['nom' => 'Flamand', 'categorie' => 'Langues'],
            ['nom' => 'Luxembourgeois', 'categorie' => 'Langues'],
            ['nom' => 'Afrikaans', 'categorie' => 'Langues'],
            ['nom' => 'Maltais', 'categorie' => 'Langues'],
            ['nom' => 'Hawaïen', 'categorie' => 'Langues'],
            ['nom' => 'Maori', 'categorie' => 'Langues'],
            ['nom' => 'Samoan', 'categorie' => 'Langues'],
            ['nom' => 'Inuktitut', 'categorie' => 'Langues'],
            ['nom' => 'Quechua', 'categorie' => 'Langues'],
            ['nom' => 'Guarani', 'categorie' => 'Langues'],
            ['nom' => 'Aymara', 'categorie' => 'Langues'],
            ['nom' => 'Yoruba', 'categorie' => 'Langues'],
            ['nom' => 'Hausa', 'categorie' => 'Langues'],
            ['nom' => 'Igbo', 'categorie' => 'Langues'],
            ['nom' => 'Wolof', 'categorie' => 'Langues'],
            ['nom' => 'Bambara', 'categorie' => 'Langues'],
            ['nom' => 'Peul', 'categorie' => 'Langues'],
            ['nom' => 'Lingala', 'categorie' => 'Langues'],
            ['nom' => 'Kikongo', 'categorie' => 'Langues'],
            ['nom' => 'Shona', 'categorie' => 'Langues'],
            ['nom' => 'Xhosa', 'categorie' => 'Langues'],
            ['nom' => 'Zoulou', 'categorie' => 'Langues'],
            ['nom' => 'Amharique', 'categorie' => 'Langues'],
            ['nom' => 'Oromo', 'categorie' => 'Langues'],
            ['nom' => 'Somali', 'categorie' => 'Langues'],
            ['nom' => 'Kinyarwanda', 'categorie' => 'Langues'],
            ['nom' => 'Malagasy', 'categorie' => 'Langues'],
        ];

        DB::table('matieres')->insert($matieres);
        
        // Afficher le nombre de langues insérées
        $count = DB::table('matieres')->count();
        $this->command->info("✅ {$count} langues insérées avec succès !");
    }
}
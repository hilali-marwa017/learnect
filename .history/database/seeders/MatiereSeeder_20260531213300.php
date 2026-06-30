<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MatiereSeeder extends Seeder
{
    public function run(): void
    {
        $matieres = [
            // Sciences
            ['nom' => 'Mathématiques', 'categorie' => 'Sciences'],
            ['nom' => 'Physique-Chimie', 'categorie' => 'Sciences'],
            ['nom' => 'SVT', 'categorie' => 'Sciences'],
            ['nom' => 'Mathématiques Appliquées', 'categorie' => 'Sciences'],
            ['nom' => 'Informatique', 'categorie' => 'Sciences'],
            ['nom' => 'Algorithmique', 'categorie' => 'Sciences'],
            ['nom' => 'Programmation Python', 'categorie' => 'Sciences'],
            ['nom' => 'Sciences de l\'Ingénieur', 'categorie' => 'Sciences'],
            
            // Langues
            ['nom' => 'Français', 'categorie' => 'Langues'],
            ['nom' => 'Anglais', 'categorie' => 'Langues'],
            ['nom' => 'Arabe', 'categorie' => 'Langues'],
            ['nom' => 'Espagnol', 'categorie' => 'Langues'],
            ['nom' => 'Allemand', 'categorie' => 'Langues'],
            ['nom' => 'Italien', 'categorie' => 'Langues'],
            
            // Lettres
            ['nom' => 'Philosophie', 'categorie' => 'Lettres'],
            ['nom' => 'Histoire-Géographie', 'categorie' => 'Lettres'],
            ['nom' => 'Français Littéraire', 'categorie' => 'Lettres'],
            
            // Économie
            ['nom' => 'Comptabilité', 'categorie' => 'Économie'],
            ['nom' => 'Économie Générale', 'categorie' => 'Économie'],
            ['nom' => 'Gestion Financière', 'categorie' => 'Économie'],
            ['nom' => 'Marketing Digital', 'categorie' => 'Économie'],
            
            // Autres
            ['nom' => 'Droit', 'categorie' => 'Droit'],
            ['nom' => 'Arts Plastiques', 'categorie' => 'Arts'],
            ['nom' => 'Musique', 'categorie' => 'Arts'],
            ['nom' => 'Sport', 'categorie' => 'Sport'],
        ];

        DB::table('matieres')->insert($matieres);
    }
}
<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class TeacherTestSeeder extends Seeder
{
    public function run(): void
    {
        // Désactiver les contraintes
        DB::statement('SET FOREIGN_KEY_CHECKS=0');
        
        // Vider les tables
        DB::table('enseigners')->truncate();
        DB::table('enseignants')->truncate();
        DB::table('users')->where('role', 'enseignant')->delete();
        DB::table('matieres')->truncate();
        
        // Réactiver les contraintes
        DB::statement('SET FOREIGN_KEY_CHECKS=1');

        // ========== MATIÈRES ==========
        DB::table('matieres')->insert([
            ['id_matiere' => 1, 'nom' => 'Mathématiques', 'categorie' => 'Sciences', 'created_at' => now(), 'updated_at' => now()],
            ['id_matiere' => 2, 'nom' => 'Physique-Chimie', 'categorie' => 'Sciences', 'created_at' => now(), 'updated_at' => now()],
            ['id_matiere' => 3, 'nom' => 'Anglais', 'categorie' => 'Langues', 'created_at' => now(), 'updated_at' => now()],
            ['id_matiere' => 4, 'nom' => 'Français', 'categorie' => 'Langues', 'created_at' => now(), 'updated_at' => now()],
            ['id_matiere' => 5, 'nom' => 'Arabe', 'categorie' => 'Langues', 'created_at' => now(), 'updated_at' => now()],
            ['id_matiere' => 6, 'nom' => 'Informatique', 'categorie' => 'Sciences', 'created_at' => now(), 'updated_at' => now()],
        ]);

        // ========== ENSEIGNANT 1 - Sofia Benani ==========
        DB::table('users')->insert([
            'utilisateur_id' => 100,
            'nom' => 'Benani',
            'prenom' => 'Sofia',
            'email' => 'sofia.benani@learnect.ma',
            'password' => Hash::make('password123'),
            'telephone' => '0612345681',
            'ville' => 'Casablanca',
            'role' => 'enseignant',
            'statut' => 'actif',
            'can_teach' => true,
            'can_learn' => false,
            'photo' => 'https://randomuser.me/api/portraits/women/68.jpg',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('enseignants')->insert([
            'utilisateur_id' => 100,
            'diplome' => 'diplome_sofia.pdf',
            'cin_recto' => 'cin_recto_sofia.jpg',
            'cin_verso' => 'cin_verso_sofia.jpg',
            'titre' => 'Professeur Agrégé de Mathématiques',
            'description_profil' => 'Ancienne élève de l\'ENS, préparation aux concours',
            'description_cours' => 'Cours de mathématiques tous niveaux',
            'tarifHeure' => 180,
            'estVerifie' => true,
            'noteMoyenne' => 4.9,
            'statut_annonce' => 'en_ligne',
            'cours_domicile' => true,
            'cours_enligne' => true,
            'cours_deplacement' => false,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // ========== ENSEIGNANT 2 - Karim Tazi ==========
        DB::table('users')->insert([
            'utilisateur_id' => 101,
            'nom' => 'Tazi',
            'prenom' => 'Karim',
            'email' => 'karim.tazi@learnect.ma',
            'password' => Hash::make('password123'),
            'telephone' => '0612345682',
            'ville' => 'Marrakech',
            'role' => 'enseignant',
            'statut' => 'actif',
            'can_teach' => true,
            'can_learn' => false,
            'photo' => 'https://randomuser.me/api/portraits/men/52.jpg',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('enseignants')->insert([
            'utilisateur_id' => 101,
            'diplome' => 'diplome_karim.pdf',
            'cin_recto' => 'cin_recto_karim.jpg',
            'cin_verso' => 'cin_verso_karim.jpg',
            'titre' => 'Docteur en Physique-Chimie',
            'description_profil' => 'Doctorant en physique quantique',
            'description_cours' => 'Cours de physique-chimie tous niveaux',
            'tarifHeure' => 220,
            'estVerifie' => true,
            'noteMoyenne' => 4.9,
            'statut_annonce' => 'en_ligne',
            'cours_domicile' => true,
            'cours_enligne' => true,
            'cours_deplacement' => false,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // ========== ENSEIGNANT 3 - Nadia Fikri ==========
        DB::table('users')->insert([
            'utilisateur_id' => 102,
            'nom' => 'Fikri',
            'prenom' => 'Nadia',
            'email' => 'nadia.fikri@learnect.ma',
            'password' => Hash::make('password123'),
            'telephone' => '0612345683',
            'ville' => 'Fès',
            'role' => 'enseignant',
            'statut' => 'actif',
            'can_teach' => true,
            'can_learn' => false,
            'photo' => 'https://randomuser.me/api/portraits/women/45.jpg',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('enseignants')->insert([
            'utilisateur_id' => 102,
            'diplome' => 'diplome_nadia.pdf',
            'cin_recto' => 'cin_recto_nadia.jpg',
            'cin_verso' => 'cin_verso_nadia.jpg',
            'titre' => 'Professeure de Langues',
            'description_profil' => 'Formatrice certifiée en langues',
            'description_cours' => 'Cours d\'anglais, français, arabe',
            'tarifHeure' => 160,
            'estVerifie' => true,
            'noteMoyenne' => 4.8,
            'statut_annonce' => 'en_ligne',
            'cours_domicile' => true,
            'cours_enligne' => true,
            'cours_deplacement' => false,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // ========== ENSEIGNANT 4 - Youssef El Fassi ==========
        DB::table('users')->insert([
            'utilisateur_id' => 103,
            'nom' => 'El Fassi',
            'prenom' => 'Youssef',
            'email' => 'youssef.elfassi@learnect.ma',
            'password' => Hash::make('password123'),
            'telephone' => '0612345684',
            'ville' => 'Tanger',
            'role' => 'enseignant',
            'statut' => 'actif',
            'can_teach' => true,
            'can_learn' => false,
            'photo' => 'https://randomuser.me/api/portraits/men/33.jpg',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('enseignants')->insert([
            'utilisateur_id' => 103,
            'diplome' => 'diplome_youssef.pdf',
            'cin_recto' => 'cin_recto_youssef.jpg',
            'cin_verso' => 'cin_verso_youssef.jpg',
            'titre' => 'Expert en Développement Web',
            'description_profil' => 'Ingénieur full-stack 8 ans d\'expérience',
            'description_cours' => 'Cours de programmation (Python, React, Laravel)',
            'tarifHeure' => 250,
            'estVerifie' => true,
            'noteMoyenne' => 4.9,
            'statut_annonce' => 'en_ligne',
            'cours_domicile' => true,
            'cours_enligne' => true,
            'cours_deplacement' => false,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // ========== TABLE PIVOT (enseigners) ==========
        DB::table('enseigners')->insert([
            // Sofia - Mathématiques
            ['id_enseignant' => 100, 'id_matiere' => 1, 'niveau' => 'Lycée', 'created_at' => now(), 'updated_at' => now()],
            
            // Karim - Physique-Chimie
            ['id_enseignant' => 101, 'id_matiere' => 2, 'niveau' => 'Lycée', 'created_at' => now(), 'updated_at' => now()],
            
            // Nadia - Anglais, Français, Arabe
            ['id_enseignant' => 102, 'id_matiere' => 3, 'niveau' => 'Lycée', 'created_at' => now(), 'updated_at' => now()],
            ['id_enseignant' => 102, 'id_matiere' => 4, 'niveau' => 'Lycée', 'created_at' => now(), 'updated_at' => now()],
            ['id_enseignant' => 102, 'id_matiere' => 5, 'niveau' => 'Lycée', 'created_at' => now(), 'updated_at' => now()],
            
            // Youssef - Informatique
            ['id_enseignant' => 103, 'id_matiere' => 6, 'niveau' => 'Université', 'created_at' => now(), 'updated_at' => now()],
        ]);
        
        $this->command->info('4 enseignants créés avec succès !');
    }
}
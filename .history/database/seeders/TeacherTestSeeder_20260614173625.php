<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class TeacherTestSeeder extends Seeder
{
    public function run()
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
            ['id_matiere' => 3, 'nom' => 'SVT', 'categorie' => 'Sciences', 'created_at' => now(), 'updated_at' => now()],
            ['id_matiere' => 4, 'nom' => 'Anglais', 'categorie' => 'Langues', 'created_at' => now(), 'updated_at' => now()],
            ['id_matiere' => 5, 'nom' => 'Français', 'categorie' => 'Langues', 'created_at' => now(), 'updated_at' => now()],
            ['id_matiere' => 6, 'nom' => 'Espagnol', 'categorie' => 'Langues', 'created_at' => now(), 'updated_at' => now()],
            ['id_matiere' => 7, 'nom' => 'Arabe', 'categorie' => 'Langues', 'created_at' => now(), 'updated_at' => now()],
            ['id_matiere' => 8, 'nom' => 'Philosophie', 'categorie' => 'Lettres', 'created_at' => now(), 'updated_at' => now()],
            ['id_matiere' => 9, 'nom' => 'Histoire-Géographie', 'categorie' => 'Lettres', 'created_at' => now(), 'updated_at' => now()],
            ['id_matiere' => 10, 'nom' => 'Informatique', 'categorie' => 'Sciences', 'created_at' => now(), 'updated_at' => now()],
        ]);

        // ========== ENSEIGNANT 1 - Sofia Benani ==========
        DB::table('users')->insert([
            'utilisateur_id' => 1,
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
            'utilisateur_id' => 1,
            'diplome' => 'diplome_sofia.pdf',
            'cin_recto' => 'cin_recto_sofia.jpg',
            'cin_verso' => 'cin_verso_sofia.jpg',
            'titre' => 'Professeur Agrégé de Mathématiques - Préparation CPGE',
            'description_profil' => 'Ancienne élève de l\'ENS de Lyon, je prépare les étudiants aux concours et examens nationaux avec une méthode éprouvée depuis 8 ans.',
            'description_cours' => 'Cours de mathématiques pour tous niveaux (Collège, Lycée, CPGE) avec exercices types et préparations intensives.',
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

        // ========== ENSEIGNANT 2 - Karim Tazi (remplace Amine Chraibi) ==========
        DB::table('users')->insert([
            'utilisateur_id' => 2,
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
            'utilisateur_id' => 2,
            'diplome' => 'diplome_karim.pdf',
            'cin_recto' => 'cin_recto_karim.jpg',
            'cin_verso' => 'cin_verso_karim.jpg',
            'titre' => 'Docteur en Physique-Chimie - Université Paris-Saclay',
            'description_profil' => 'Doctorant en physique quantique, je rends les sciences accessibles avec des explications claires et des exercices pratiques.',
            'description_cours' => 'Cours de physique-chimie du collège à l\'université, préparation aux concours d\'ingénieurs.',
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

        // ========== ENSEIGNANT 3 - Nadia Fikri (remplace Leila Moukrim) ==========
        DB::table('users')->insert([
            'utilisateur_id' => 3,
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
            'utilisateur_id' => 3,
            'diplome' => 'diplome_nadia.pdf',
            'cin_recto' => 'cin_recto_nadia.jpg',
            'cin_verso' => 'cin_verso_nadia.jpg',
            'titre' => 'Professeure de Langues (Anglais, Français, Arabe)',
            'description_profil' => 'Formatrice certifiée en langues avec 10 ans d\'expérience, je vous aide à maîtriser la communication écrite et orale.',
            'description_cours' => 'Cours d\'anglais, français et arabe pour tous niveaux. Préparation TOEIC, IELTS, DALF.',
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
            'utilisateur_id' => 4,
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
            'utilisateur_id' => 4,
            'diplome' => 'diplome_youssef.pdf',
            'cin_recto' => 'cin_recto_youssef.jpg',
            'cin_verso' => 'cin_verso_youssef.jpg',
            'titre' => 'Expert en Développement Web et Programmation',
            'description_profil' => 'Ingénieur en informatique, développeur full-stack depuis 8 ans, je forme les étudiants aux métiers du numérique.',
            'description_cours' => 'Cours de programmation (Python, JavaScript, React, Laravel) et préparation aux certifications.',
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

        // ========== TABLE PIVOT ==========
        DB::table('enseigners')->insert([
            // Sofia - Mathématiques
            ['id_enseignant' => 1, 'id_matiere' => 1, 'niveau' => 'Lycée', 'created_at' => now(), 'updated_at' => now()],
            ['id_enseignant' => 1, 'id_matiere' => 10, 'niveau' => 'Lycée', 'created_at' => now(), 'updated_at' => now()],
            
            // Karim - Physique-Chimie + Maths
            ['id_enseignant' => 2, 'id_matiere' => 2, 'niveau' => 'Lycée', 'created_at' => now(), 'updated_at' => now()],
            ['id_enseignant' => 2, 'id_matiere' => 1, 'niveau' => 'Lycée', 'created_at' => now(), 'updated_at' => now()],
            
            // Nadia - Langues
            ['id_enseignant' => 3, 'id_matiere' => 4, 'niveau' => 'Lycée', 'created_at' => now(), 'updated_at' => now()],
            ['id_enseignant' => 3, 'id_matiere' => 5, 'niveau' => 'Lycée', 'created_at' => now(), 'updated_at' => now()],
            ['id_enseignant' => 3, 'id_matiere' => 7, 'niveau' => 'Lycée', 'created_at' => now(), 'updated_at' => now()],
            ['id_enseignant' => 3, 'id_matiere' => 6, 'niveau' => 'Lycée', 'created_at' => now(), 'updated_at' => now()],
            
            // Youssef - Informatique
            ['id_enseignant' => 4, 'id_matiere' => 10, 'niveau' => 'Université', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }
}
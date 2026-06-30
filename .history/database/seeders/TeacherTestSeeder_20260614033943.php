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
        
        // Réactiver les contraintes
        DB::statement('SET FOREIGN_KEY_CHECKS=1');

        // ========== ENSEIGNANT 1 ==========
        $user1 = DB::table('users')->insertGetId([
            'nom' => 'Benani',
            'prenom' => 'Sofia',
            'email' => 'sofia.benani@learnect.ma',
            'password' => Hash::make('password123'),
            'telephone' => '0612345681', // Changé
            'ville' => 'Casablanca',
            'role' => 'enseignant',
            'statut' => 'actif',
            'can_teach' => true,
            'can_learn' => false,
            'photo' => 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('enseignants')->insert([
            'utilisateur_id' => $user1,
            'diplome' => 'diplome_sofia.pdf',
            'cin_recto' => 'cin_recto_sofia.jpg',
            'cin_verso' => 'cin_verso_sofia.jpg',
            'titre' => 'Professeur Agrégé de Mathématiques',
            'description_profil' => 'Ancienne élève de l\'ENS, préparation aux concours',
            'description_cours' => 'Cours de mathématiques tous niveaux',
            'tarifHeure' => 180,
            'estVerifie' => true,
            'noteMoyenne' => 4.8,
            'statut_annonce' => 'en_ligne',
            'cours_domicile' => true,
            'cours_enligne' => true,
            'cours_deplacement' => false,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // ========== ENSEIGNANT 2 ==========
        $user2 = DB::table('users')->insertGetId([
            'nom' => 'Chraibi',
            'prenom' => 'Amine',
            'email' => 'amine.chraibi@learnect.ma',
            'password' => Hash::make('password123'),
            'telephone' => '0612345682', // Changé
            'ville' => 'Marrakech',
            'role' => 'enseignant',
            'statut' => 'actif',
            'can_teach' => true,
            'can_learn' => false,
            'photo' => 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=400&h=400&fit=crop',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('enseignants')->insert([
            'utilisateur_id' => $user2,
            'diplome' => 'diplome_amine.pdf',
            'cin_recto' => 'cin_recto_amine.jpg',
            'cin_verso' => 'cin_verso_amine.jpg',
            'titre' => 'Spécialiste en Physique-Chimie',
            'description_profil' => '10 ans d\'expérience en classes préparatoires',
            'description_cours' => 'Cours de physique-chimie',
            'tarifHeure' => 200,
            'estVerifie' => true,
            'noteMoyenne' => 4.9,
            'statut_annonce' => 'en_ligne',
            'cours_domicile' => true,
            'cours_enligne' => true,
            'cours_deplacement' => false,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // ========== ENSEIGNANT 3 ==========
        $user3 = DB::table('users')->insertGetId([
            'nom' => 'Moukrim',
            'prenom' => 'Leila',
            'email' => 'leila.moukrim@learnect.ma',
            'password' => Hash::make('password123'),
            'telephone' => '0612345683', // Changé
            'ville' => 'Rabat',
            'role' => 'enseignant',
            'statut' => 'actif',
            'can_teach' => true,
            'can_learn' => false,
            ''https://randomuser.me/api/portraits/women/68.jpg',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('enseignants')->insert([
            'utilisateur_id' => $user3,
            'diplome' => 'diplome_leila.pdf',
            'cin_recto' => 'cin_recto_leila.jpg',
            'cin_verso' => 'cin_verso_leila.jpg',
            'titre' => 'Professeur Expérimentée de SVT',
            'description_profil' => 'Passionnée par les sciences de la vie',
            'description_cours' => 'Cours de SVT',
            'tarifHeure' => 150,
            'estVerifie' => true,
            'noteMoyenne' => 5.0,
            'statut_annonce' => 'en_ligne',
            'cours_domicile' => true,
            'cours_enligne' => true,
            'cours_deplacement' => false,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // ========== MATIÈRES ==========
        $mathId = DB::table('matieres')->insertGetId([
            'nom' => 'Mathématiques',
            'categorie' => 'Sciences',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $pcId = DB::table('matieres')->insertGetId([
            'nom' => 'Physique-Chimie',
            'categorie' => 'Sciences',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $svtId = DB::table('matieres')->insertGetId([
            'nom' => 'SVT',
            'categorie' => 'Sciences',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // ========== PIVOT ==========
        DB::table('enseigners')->insert([
            ['id_enseignant' => $user1, 'id_matiere' => $mathId, 'niveau' => 'Lycée', 'created_at' => now(), 'updated_at' => now()],
            ['id_enseignant' => $user2, 'id_matiere' => $pcId, 'niveau' => 'Lycée', 'created_at' => now(), 'updated_at' => now()],
            ['id_enseignant' => $user3, 'id_matiere' => $svtId, 'niveau' => 'Lycée', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }
}
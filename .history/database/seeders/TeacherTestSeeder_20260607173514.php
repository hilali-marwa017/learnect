<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class TeacherTestSeeder extends Seeder
{
    public function run()
    {
        // ========== ENSEIGNANT 1 ==========
        $user1 = DB::table('users')->insertGetId([
            'nom' => 'Benani',
            'prenom' => 'Sofia',
            'email' => 'sofia@learnect.ma',
            'password' => Hash::make('password123'),
            'telephone' => '0612345678',
            'ville' => 'Casablanca',
            'role' => 'enseignant',
            'statut' => 'actif',
            'can_teach' => true,
            'can_learn' => false,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('enseignants')->insert([
            'utilisateur_id' => $user1,
            'diplome' => 'diplome_sofia.pdf',
            'cin_recto' => 'cin_recto_sofia.jpg',
            'cin_verso' => 'cin_verso_sofia.jpg',
            'titre' => 'Professeur Agrégé de Mathématiques',
            'description_profil' => 'Préparation intensive aux Classes Préparatoires et examens nationaux',
            'description_cours' => 'Cours de mathématiques pour tous niveaux',
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
            'email' => 'amine@learnect.ma',
            'password' => Hash::make('password123'),
            'telephone' => '0612345679',
            'ville' => 'Marrakech',
            'role' => 'enseignant',
            'statut' => 'actif',
            'can_teach' => true,
            'can_learn' => false,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('enseignants')->insert([
            'utilisateur_id' => $user2,
            'diplome' => 'diplome_amine.pdf',
            'cin_recto' => 'cin_recto_amine.jpg',
            'cin_verso' => 'cin_verso_amine.jpg',
            'titre' => 'Spécialiste en Physique-Chimie',
            'description_profil' => 'Excellence Lycée, CPGE & Facultés',
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
            'email' => 'leila@learnect.ma',
            'password' => Hash::make('password123'),
            'telephone' => '0612345680',
            'ville' => 'Rabat',
            'role' => 'enseignant',
            'statut' => 'actif',
            'can_teach' => true,
            'can_learn' => false,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('enseignants')->insert([
            'utilisateur_id' => $user3,
            'diplome' => 'diplome_leila.pdf',
            'cin_recto' => 'cin_recto_leila.jpg',
            'cin_verso' => 'cin_verso_leila.jpg',
            'titre' => 'Professeur Expérimentée de SVT',
            'description_profil' => 'Terminale Bac SMB & PC Français/Arabe',
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

        // ========== TABLE PIVOT (enseigners) ==========
        DB::table('enseigners')->insert([
            ['id_enseignant' => $user1, 'id_matiere' => $mathId, 'niveau' => 'Lycée', 'created_at' => now(), 'updated_at' => now()],
            ['id_enseignant' => $user2, 'id_matiere' => $pcId, 'niveau' => 'Lycée', 'created_at' => now(), 'updated_at' => now()],
            ['id_enseignant' => $user3, 'id_matiere' => $svtId, 'niveau' => 'Lycée', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }
}
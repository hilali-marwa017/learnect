<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class TeacherTestSeeder extends Seeder
{
    public function run(): void
    {
        // Insertion des matières
        DB::table('matieres')->insert([
            ['id_matiere' => 1, 'nom' => 'Mathématiques', 'categorie' => 'Sciences'],
            ['id_matiere' => 2, 'nom' => 'Physique-Chimie', 'categorie' => 'Sciences'],
            ['id_matiere' => 3, 'nom' => 'Anglais', 'categorie' => 'Langues'],
            ['id_matiere' => 4, 'nom' => 'Français', 'categorie' => 'Langues'],
            ['id_matiere' => 5, 'nom' => 'Informatique', 'categorie' => 'Sciences'],
        ]);

        // Insertion des utilisateurs (enseignants)
        DB::table('users')->insert([
            [
                'utilisateur_id' => 100,
                'nom' => 'Benani',
                'prenom' => 'Sofia',
                'email' => 'sofia@learnect.ma',
                'password' => Hash::make('password'),
                'telephone' => '0612345601',
                'ville' => 'Casablanca',
                'role' => 'enseignant',
                'statut' => 'actif',
                'can_teach' => true,
                'can_learn' => false,
                'photo' => 'https://randomuser.me/api/portraits/women/68.jpg',
            ],
            [
                'utilisateur_id' => 101,
                'nom' => 'Tazi',
                'prenom' => 'Karim',
                'email' => 'karim@learnect.ma',
                'password' => Hash::make('password'),
                'telephone' => '0612345602',
                'ville' => 'Marrakech',
                'role' => 'enseignant',
                'statut' => 'actif',
                'can_teach' => true,
                'can_learn' => false,
                'photo' => 'https://randomuser.me/api/portraits/men/52.jpg',
            ],
            [
                'utilisateur_id' => 102,
                'nom' => 'Fikri',
                'prenom' => 'Nadia',
                'email' => 'nadia@learnect.ma',
                'password' => Hash::make('password'),
                'telephone' => '0612345603',
                'ville' => 'Fès',
                'role' => 'enseignant',
                'statut' => 'actif',
                'can_teach' => true,
                'can_learn' => false,
                'photo' => 'https://randomuser.me/api/portraits/women/45.jpg',
            ],
            [
                'utilisateur_id' => 103,
                'nom' => 'El Fassi',
                'prenom' => 'Youssef',
                'email' => 'youssef@learnect.ma',
                'password' => Hash::make('password'),
                'telephone' => '0612345604',
                'ville' => 'Tanger',
                'role' => 'enseignant',
                'statut' => 'actif',
                'can_teach' => true,
                'can_learn' => false,
                'photo' => 'https://randomuser.me/api/portraits/men/33.jpg',
            ],
        ]);

        // Insertion des enseignants
        DB::table('enseignants')->insert([
            [
                'utilisateur_id' => 100,
                'diplome' => 'Master ENS',
                'titre' => 'Professeur de Mathématiques',
                'description_profil' => 'Professeure expérimentée en mathématiques',
                'description_cours' => 'Cours de maths tous niveaux',
                'tarifHeure' => 180,
                'estVerifie' => true,
                'noteMoyenne' => 4.9,
                'statut_annonce' => 'en_ligne',
                'cours_domicile' => true,
                'cours_enligne' => true,
            ],
            [
                'utilisateur_id' => 101,
                'diplome' => 'Doctorat Physique',
                'titre' => 'Docteur en Physique-Chimie',
                'description_profil' => 'Spécialiste en physique quantique',
                'description_cours' => 'Cours de physique-chimie',
                'tarifHeure' => 220,
                'estVerifie' => true,
                'noteMoyenne' => 4.9,
                'statut_annonce' => 'en_ligne',
                'cours_domicile' => true,
                'cours_enligne' => true,
            ],
            [
                'utilisateur_id' => 102,
                'diplome' => 'Master Langues',
                'titre' => 'Professeure de Langues',
                'description_profil' => 'Formatrice certifiée en langues',
                'description_cours' => 'Cours d\'anglais et français',
                'tarifHeure' => 160,
                'estVerifie' => true,
                'noteMoyenne' => 4.8,
                'statut_annonce' => 'en_ligne',
                'cours_domicile' => true,
                'cours_enligne' => true,
            ],
            [
                'utilisateur_id' => 103,
                'diplome' => 'Ingénieur Informatique',
                'titre' => 'Expert en Développement Web',
                'description_profil' => 'Développeur full-stack 8 ans',
                'description_cours' => 'Cours de programmation',
                'tarifHeure' => 250,
                'estVerifie' => true,
                'noteMoyenne' => 4.9,
                'statut_annonce' => 'en_ligne',
                'cours_domicile' => true,
                'cours_enligne' => true,
            ],
        ]);

        // Insertion dans la table pivot (enseigners)
        DB::table('enseigners')->insert([
            ['id_enseignant' => 100, 'id_matiere' => 1, 'niveau' => 'Lycée'],
            ['id_enseignant' => 101, 'id_matiere' => 2, 'niveau' => 'Lycée'],
            ['id_enseignant' => 102, 'id_matiere' => 3, 'niveau' => 'Lycée'],
            ['id_enseignant' => 102, 'id_matiere' => 4, 'niveau' => 'Lycée'],
            ['id_enseignant' => 103, 'id_matiere' => 5, 'niveau' => 'Université'],
        ]);
    }
}
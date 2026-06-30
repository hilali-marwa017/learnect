<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class TeacherTestSeeder extends Seeder
{
    public function run(): void
    {
        // Insertion des matières - SANS spécifier id_matiere
        DB::table('matieres')->insert([
            ['nom' => 'Mathématiques', 'categorie' => 'Sciences'],
            ['nom' => 'Physique-Chimie', 'categorie' => 'Sciences'],
            ['nom' => 'Anglais', 'categorie' => 'Langues'],
            ['nom' => 'Français', 'categorie' => 'Langues'],
            ['nom' => 'Informatique', 'categorie' => 'Sciences'],
        ]);

        // Récupérer les IDs des matières insérées
        $mathsId = DB::table('matieres')->where('nom', 'Mathématiques')->value('id_matiere');
        $physiqueId = DB::table('matieres')->where('nom', 'Physique-Chimie')->value('id_matiere');
        $anglaisId = DB::table('matieres')->where('nom', 'Anglais')->value('id_matiere');
        $francaisId = DB::table('matieres')->where('nom', 'Français')->value('id_matiere');
        $informatiqueId = DB::table('matieres')->where('nom', 'Informatique')->value('id_matiere');

        // Insertion des utilisateurs (enseignants) - SANS spécifier utilisateur_id
        DB::table('users')->insert([
            [
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
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
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
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
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
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
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
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);

        // Récupérer les IDs des utilisateurs insérés
        $sofiaId = DB::table('users')->where('email', 'sofia@learnect.ma')->value('utilisateur_id');
        $karimId = DB::table('users')->where('email', 'karim@learnect.ma')->value('utilisateur_id');
        $nadiaId = DB::table('users')->where('email', 'nadia@learnect.ma')->value('utilisateur_id');
        $youssefId = DB::table('users')->where('email', 'youssef@learnect.ma')->value('utilisateur_id');

        // Insertion des enseignants
        DB::table('enseignants')->insert([
            [
                'utilisateur_id' => $sofiaId,
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
                'cin_recto' => 'cin_recto_default.jpg',
                'cin_verso' => 'cin_verso_default.jpg',
                'diplome_fichier' => 'diplome_sofia.pdf',
                'justificatif_domicile' => 'justificatif_sofia.jpg',
                'photo_profil' => 'photo_sofia.jpg',
                'statut_validation' => 'valide',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'utilisateur_id' => $karimId,
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
                'cin_recto' => 'cin_recto_default.jpg',
                'cin_verso' => 'cin_verso_default.jpg',
                'diplome_fichier' => 'diplome_karim.pdf',
                'justificatif_domicile' => 'justificatif_karim.jpg',
                'photo_profil' => 'photo_karim.jpg',
                'statut_validation' => 'valide',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'utilisateur_id' => $nadiaId,
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
                'cin_recto' => 'cin_recto_default.jpg',
                'cin_verso' => 'cin_verso_default.jpg',
                'diplome_fichier' => 'diplome_nadia.pdf',
                'justificatif_domicile' => 'justificatif_nadia.jpg',
                'photo_profil' => 'photo_nadia.jpg',
                'statut_validation' => 'valide',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'utilisateur_id' => $youssefId,
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
                'cin_recto' => 'cin_recto_default.jpg',
                'cin_verso' => 'cin_verso_default.jpg',
                'diplome_fichier' => 'diplome_youssef.pdf',
                'justificatif_domicile' => 'justificatif_youssef.jpg',
                'photo_profil' => 'photo_youssef.jpg',
                'statut_validation' => 'valide',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);

        // Récupérer les IDs des enseignants
        $sofiaEnseignantId = DB::table('enseignants')->where('utilisateur_id', $sofiaId)->value('id_enseignant');
        $karimEnseignantId = DB::table('enseignants')->where('utilisateur_id', $karimId)->value('id_enseignant');
        $nadiaEnseignantId = DB::table('enseignants')->where('utilisateur_id', $nadiaId)->value('id_enseignant');
        $youssefEnseignantId = DB::table('enseignants')->where('utilisateur_id', $youssefId)->value('id_enseignant');

        // Insertion dans la table pivot (enseigners)
        DB::table('enseigners')->insert([
            ['id_enseignant' => $sofiaEnseignantId, 'id_matiere' => $mathsId, 'niveau' => 'Lycée'],
            ['id_enseignant' => $karimEnseignantId, 'id_matiere' => $physiqueId, 'niveau' => 'Lycée'],
            ['id_enseignant' => $nadiaEnseignantId, 'id_matiere' => $anglaisId, 'niveau' => 'Lycée'],
            ['id_enseignant' => $nadiaEnseignantId, 'id_matiere' => $francaisId, 'niveau' => 'Lycée'],
            ['id_enseignant' => $youssefEnseignantId, 'id_matiere' => $informatiqueId, 'niveau' => 'Université'],
        ]);
    }
}
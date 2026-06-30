// database/seeders/EnseignantSeeder.php
<?php


use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class EnseignantSeeder extends Seeder
{
    public function run()
    {
        // Créer un user enseignant
        $userId = DB::table('users')->insertGetId([
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

        // Créer le profil enseignant
        DB::table('enseignants')->insert([
            'utilisateur_id' => $userId,
            'diplome' => 'diplome_sofia.pdf',
            'titre' => 'Professeur Agrégé de Mathématiques',
            'description_profil' => 'Préparation intensive aux Classes Préparatoires et examens nationaux',
            'description_cours' => 'Cours de mathématiques pour tous niveaux',
            'cours_domicile' => true,
            'cours_enligne' => true,
            'cours_deplacement' => false,
            'tarifHeure' => 180,
            'estVerifie' => true,
            'noteMoyenne' => 4.8,
            'statut_annonce' => 'en_ligne',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Enseignant 2
        $userId2 = DB::table('users')->insertGetId([
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
            'utilisateur_id' => $userId2,
            'diplome' => 'diplome_amine.pdf',
            'titre' => 'Spécialiste en Physique-Chimie',
            'description_profil' => 'Excellence Lycée, CPGE & Facultés',
            'description_cours' => 'Cours de physique-chimie',
            'cours_domicile' => true,
            'cours_enligne' => true,
            'cours_deplacement' => false,
            'tarifHeure' => 200,
            'estVerifie' => true,
            'noteMoyenne' => 4.9,
            'statut_annonce' => 'en_ligne',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
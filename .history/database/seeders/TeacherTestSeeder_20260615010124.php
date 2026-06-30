<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class TeacherTestSeeder extends Seeder
{
    public function run(): void
    {
        // Désactiver temporairement les contraintes de clés étrangères
        DB::statement('SET FOREIGN_KEY_CHECKS=0');
        
        // Supprimer les données dans le bon ordre (en commençant par les tables enfants)
        DB::table('enseigners')->truncate();
        DB::table('avis')->truncate();
        DB::table('reservations')->truncate();
        DB::table('offres')->truncate();
        DB::table('documents')->truncate();
        DB::table('enseignants')->truncate();
        DB::table('users')->where('role', 'enseignant')->delete();
        DB::table('matieres')->truncate();
        
        // Réactiver les contraintes
        DB::statement('SET FOREIGN_KEY_CHECKS=1');

        // 2. Insertion des matières
        $matieres = [
            ['nom' => 'Mathématiques', 'categorie' => 'Sciences'],
            ['nom' => 'Physique-Chimie', 'categorie' => 'Sciences'],
            ['nom' => 'Anglais', 'categorie' => 'Langues'],
            ['nom' => 'Français', 'categorie' => 'Langues'],
            ['nom' => 'Informatique', 'categorie' => 'Sciences'],
        ];
        
        foreach ($matieres as $matiere) {
            DB::table('matieres')->insert($matiere);
        }

        // Récupérer les IDs des matières
        $mathsId = DB::table('matieres')->where('nom', 'Mathématiques')->value('id_matiere');
        $physiqueId = DB::table('matieres')->where('nom', 'Physique-Chimie')->value('id_matiere');
        $anglaisId = DB::table('matieres')->where('nom', 'Anglais')->value('id_matiere');
        $francaisId = DB::table('matieres')->where('nom', 'Français')->value('id_matiere');
        $informatiqueId = DB::table('matieres')->where('nom', 'Informatique')->value('id_matiere');

        // 3. Insertion des utilisateurs (enseignants)
        $users = [
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
        ];

        foreach ($users as $user) {
            DB::table('users')->insert($user);
        }

        // Récupérer les IDs des utilisateurs
        $sofiaId = DB::table('users')->where('email', 'sofia@learnect.ma')->value('utilisateur_id');
        $karimId = DB::table('users')->where('email', 'karim@learnect.ma')->value('utilisateur_id');
        $nadiaId = DB::table('users')->where('email', 'nadia@learnect.ma')->value('utilisateur_id');
        $youssefId = DB::table('users')->where('email', 'youssef@learnect.ma')->value('utilisateur_id');

        // 4. Insertion des enseignants
        $enseignants = [
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
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        foreach ($enseignants as $enseignant) {
            DB::table('enseignants')->insert($enseignant);
        }

        // Récupérer les IDs des enseignants
        $sofiaEnseignantId = DB::table('enseignants')->where('utilisateur_id', $sofiaId)->value('id_enseignant');
        $karimEnseignantId = DB::table('enseignants')->where('utilisateur_id', $karimId)->value('id_enseignant');
        $nadiaEnseignantId = DB::table('enseignants')->where('utilisateur_id', $nadiaId)->value('id_enseignant');
        $youssefEnseignantId = DB::table('enseignants')->where('utilisateur_id', $youssefId)->value('id_enseignant');

        // 5. Insertion dans la table pivot (enseigners)
        $enseigners = [
            ['id_enseignant' => $sofiaEnseignantId, 'id_matiere' => $mathsId, 'niveau' => 'Lycée'],
            ['id_enseignant' => $karimEnseignantId, 'id_matiere' => $physiqueId, 'niveau' => 'Lycée'],
            ['id_enseignant' => $nadiaEnseignantId, 'id_matiere' => $anglaisId, 'niveau' => 'Lycée'],
            ['id_enseignant' => $nadiaEnseignantId, 'id_matiere' => $francaisId, 'niveau' => 'Lycée'],
            ['id_enseignant' => $youssefEnseignantId, 'id_matiere' => $informatiqueId, 'niveau' => 'Université'],
        ];

        foreach ($enseigners as $enseigner) {
            DB::table('enseigners')->insert($enseigner);
        }
        
        echo "\n✅ SEED COMPLETED SUCCESSFULLY!\n";
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
        echo "📚 Matières: " . DB::table('matieres')->count() . "\n";
        echo "👨‍🏫 Enseignants: " . DB::table('enseignants')->count() . "\n";
        echo "👤 Users: " . DB::table('users')->where('role', 'enseignant')->count() . "\n";
        echo "🔗 Relations: " . DB::table('enseigners')->count() . "\n";
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
    }
}
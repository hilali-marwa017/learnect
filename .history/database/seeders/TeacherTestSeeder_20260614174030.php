<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Enseignant;
use App\Models\Matiere;

class TeacherTestSeeder extends Seeder
{
    public function run(): void
    {
        // Désactiver les contraintes
        DB::statement('SET FOREIGN_KEY_CHECKS=0');
        
        // Vider les tables dans le bon ordre
        DB::table('enseigners')->truncate();
        DB::table('enseignants')->truncate();
        DB::table('users')->where('role', 'enseignant')->delete();
        DB::table('matieres')->truncate();
        
        // Réactiver les contraintes
        DB::statement('SET FOREIGN_KEY_CHECKS=1');

        // ========== MATIÈRES ==========
        $maths = Matiere::create(['nom' => 'Mathématiques', 'categorie' => 'Sciences']);
        $pc = Matiere::create(['nom' => 'Physique-Chimie', 'categorie' => 'Sciences']);
        $svt = Matiere::create(['nom' => 'SVT', 'categorie' => 'Sciences']);
        $anglais = Matiere::create(['nom' => 'Anglais', 'categorie' => 'Langues']);
        $francais = Matiere::create(['nom' => 'Français', 'categorie' => 'Langues']);
        $arabe = Matiere::create(['nom' => 'Arabe', 'categorie' => 'Langues']);
        $informatique = Matiere::create(['nom' => 'Informatique', 'categorie' => 'Sciences']);

        // ========== ENSEIGNANT 1 - Sofia Benani ==========
        $user1 = User::create([
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
        ]);

        Enseignant::create([
            'utilisateur_id' => $user1->utilisateur_id,
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
        ]);
        
        // Associer les matières
        $user1->matieres()->attach($maths->id_matiere, ['niveau' => 'Lycée']);

        // ========== ENSEIGNANT 2 - Karim Tazi ==========
        $user2 = User::create([
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
        ]);

        Enseignant::create([
            'utilisateur_id' => $user2->utilisateur_id,
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
        ]);
        
        $user2->matieres()->attach($pc->id_matiere, ['niveau' => 'Lycée']);

        // ========== ENSEIGNANT 3 - Nadia Fikri ==========
        $user3 = User::create([
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
        ]);

        Enseignant::create([
            'utilisateur_id' => $user3->utilisateur_id,
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
        ]);
        
        $user3->matieres()->attach($anglais->id_matiere, ['niveau' => 'Lycée']);
        $user3->matieres()->attach($francais->id_matiere, ['niveau' => 'Lycée']);
        $user3->matieres()->attach($arabe->id_matiere, ['niveau' => 'Lycée']);

        // ========== ENSEIGNANT 4 - Youssef El Fassi ==========
        $user4 = User::create([
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
        ]);

        Enseignant::create([
            'utilisateur_id' => $user4->utilisateur_id,
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
        ]);
        
        $user4->matieres()->attach($informatique->id_matiere, ['niveau' => 'Université']);

        $this->command->info('4 enseignants créés avec succès !');
    }
}
<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MatiereSeeder extends Seeder
{
    public function run(): void
    {
        $matieres = [
            // ========== SCIENCES ==========
            ['nom' => 'Mathématiques', 'categorie' => 'Sciences'],
            ['nom' => 'Physique-Chimie', 'categorie' => 'Sciences'],
            ['nom' => 'SVT', 'categorie' => 'Sciences'],
            ['nom' => 'Mathématiques Appliquées', 'categorie' => 'Sciences'],
            ['nom' => 'Informatique', 'categorie' => 'Sciences'],
            ['nom' => 'Algorithmique', 'categorie' => 'Sciences'],
            ['nom' => 'Programmation Python', 'categorie' => 'Sciences'],
            ['nom' => 'Sciences de l\'Ingénieur', 'categorie' => 'Sciences'],
            ['nom' => 'Physique', 'categorie' => 'Sciences'],
            ['nom' => 'Chimie', 'categorie' => 'Sciences'],
            ['nom' => 'Biologie', 'categorie' => 'Sciences'],
            ['nom' => 'Géologie', 'categorie' => 'Sciences'],
            ['nom' => 'Astronomie', 'categorie' => 'Sciences'],
            ['nom' => 'Robotique', 'categorie' => 'Sciences'],
            ['nom' => 'Intelligence Artificielle', 'categorie' => 'Sciences'],
            ['nom' => 'Data Science', 'categorie' => 'Sciences'],
            ['nom' => 'Cybersécurité', 'categorie' => 'Sciences'],
            ['nom' => 'Réseaux et Télécommunications', 'categorie' => 'Sciences'],
            ['nom' => 'Développement Web', 'categorie' => 'Sciences'],
            ['nom' => 'Développement Mobile', 'categorie' => 'Sciences'],
            ['nom' => 'Base de données', 'categorie' => 'Sciences'],
            
            // ========== LANGUES ==========
            ['nom' => 'Français', 'categorie' => 'Langues'],
            ['nom' => 'Anglais', 'categorie' => 'Langues'],
            ['nom' => 'Arabe', 'categorie' => 'Langues'],
            ['nom' => 'Espagnol', 'categorie' => 'Langues'],
            ['nom' => 'Allemand', 'categorie' => 'Langues'],
            ['nom' => 'Italien', 'categorie' => 'Langues'],
            ['nom' => 'Russe', 'categorie' => 'Langues'],
            ['nom' => 'Chinois', 'categorie' => 'Langues'],
            ['nom' => 'Japonais', 'categorie' => 'Langues'],
            ['nom' => 'Coréen', 'categorie' => 'Langues'],
            ['nom' => 'Portugais', 'categorie' => 'Langues'],
            ['nom' => 'Néerlandais', 'categorie' => 'Langues'],
            ['nom' => 'Turc', 'categorie' => 'Langues'],
            ['nom' => 'Hébreu', 'categorie' => 'Langues'],
            
            // ========== LETTRES ==========
            ['nom' => 'Philosophie', 'categorie' => 'Lettres'],
            ['nom' => 'Histoire-Géographie', 'categorie' => 'Lettres'],
            ['nom' => 'Français Littéraire', 'categorie' => 'Lettres'],
            ['nom' => 'Littérature Anglaise', 'categorie' => 'Lettres'],
            ['nom' => 'Littérature Arabe', 'categorie' => 'Lettres'],
            ['nom' => 'Sciences Politiques', 'categorie' => 'Lettres'],
            ['nom' => 'Sociologie', 'categorie' => 'Lettres'],
            ['nom' => 'Psychologie', 'categorie' => 'Lettres'],
            ['nom' => 'Pédagogie', 'categorie' => 'Lettres'],
            
            // ========== ÉCONOMIE ==========
            ['nom' => 'Comptabilité', 'categorie' => 'Économie'],
            ['nom' => 'Économie Générale', 'categorie' => 'Économie'],
            ['nom' => 'Gestion Financière', 'categorie' => 'Économie'],
            ['nom' => 'Marketing Digital', 'categorie' => 'Économie'],
            ['nom' => 'Marketing', 'categorie' => 'Économie'],
            ['nom' => 'Commerce International', 'categorie' => 'Économie'],
            ['nom' => 'Logistique', 'categorie' => 'Économie'],
            ['nom' => 'Ressources Humaines', 'categorie' => 'Économie'],
            ['nom' => 'Management', 'categorie' => 'Économie'],
            ['nom' => 'Entrepreneuriat', 'categorie' => 'Économie'],
            ['nom' => 'Finance Islamique', 'categorie' => 'Économie'],
            ['nom' => 'Audit et Contrôle', 'categorie' => 'Économie'],
            ['nom' => 'Analyse Financière', 'categorie' => 'Économie'],
            ['nom' => 'Trading', 'categorie' => 'Économie'],
            ['nom' => 'Cryptomonnaies', 'categorie' => 'Économie'],
            
            // ========== DROIT ==========
            ['nom' => 'Droit', 'categorie' => 'Droit'],
            ['nom' => 'Droit des Affaires', 'categorie' => 'Droit'],
            ['nom' => 'Droit International', 'categorie' => 'Droit'],
            ['nom' => 'Droit du Travail', 'categorie' => 'Droit'],
            ['nom' => 'Droit Pénal', 'categorie' => 'Droit'],
            ['nom' => 'Droit de la Famille', 'categorie' => 'Droit'],
            
            // ========== ARTS ==========
            ['nom' => 'Arts Plastiques', 'categorie' => 'Arts'],
            ['nom' => 'Musique', 'categorie' => 'Arts'],
            ['nom' => 'Dessin', 'categorie' => 'Arts'],
            ['nom' => 'Peinture', 'categorie' => 'Arts'],
            ['nom' => 'Sculpture', 'categorie' => 'Arts'],
            ['nom' => 'Photographie', 'categorie' => 'Arts'],
            ['nom' => 'Cinéma', 'categorie' => 'Arts'],
            ['nom' => 'Théâtre', 'categorie' => 'Arts'],
            ['nom' => 'Danse', 'categorie' => 'Arts'],
            ['nom' => 'Chant', 'categorie' => 'Arts'],
            ['nom' => 'Piano', 'categorie' => 'Arts'],
            ['nom' => 'Guitare', 'categorie' => 'Arts'],
            ['nom' => 'Violon', 'categorie' => 'Arts'],
            ['nom' => 'Batterie', 'categorie' => 'Arts'],
            
            // ========== SPORT ==========
            ['nom' => 'Sport', 'categorie' => 'Sport'],
            ['nom' => 'Football', 'categorie' => 'Sport'],
            ['nom' => 'Basketball', 'categorie' => 'Sport'],
            ['nom' => 'Tennis', 'categorie' => 'Sport'],
            ['nom' => 'Natation', 'categorie' => 'Sport'],
            ['nom' => 'Athlétisme', 'categorie' => 'Sport'],
            ['nom' => 'Arts Martiaux', 'categorie' => 'Sport'],
            ['nom' => 'Yoga', 'categorie' => 'Sport'],
            ['nom' => 'Fitness', 'categorie' => 'Sport'],
            ['nom' => 'Musculation', 'categorie' => 'Sport'],
            
            // ========== AUTRES ==========
            ['nom' => 'Aide aux devoirs', 'categorie' => 'Soutien'],
            ['nom' => 'Préparation Concours', 'categorie' => 'Soutien'],
            ['nom' => 'Préparation Bac', 'categorie' => 'Soutien'],
            ['nom' => 'Préparation CRPE', 'categorie' => 'Soutien'],
            ['nom' => 'Préparation TOEIC', 'categorie' => 'Soutien'],
            ['nom' => 'Préparation IELTS', 'categorie' => 'Soutien'],
            ['nom' => 'Méthodologie', 'categorie' => 'Soutien'],
            ['nom' => 'Orientation Scolaire', 'categorie' => 'Soutien'],
            ['nom' => 'Coaching Scolaire', 'categorie' => 'Soutien'],
            ['nom' => 'Bureautique', 'categorie' => 'Informatique'],
            ['nom' => 'Excel', 'categorie' => 'Informatique'],
            ['nom' => 'Word', 'categorie' => 'Informatique'],
            ['nom' => 'PowerPoint', 'categorie' => 'Informatique'],
            ['nom' => 'Photoshop', 'categorie' => 'Informatique'],
            ['nom' => 'Illustrator', 'categorie' => 'Informatique'],
            ['nom' => 'AutoCAD', 'categorie' => 'Informatique'],
            ['nom' => 'SolidWorks', 'categorie' => 'Informatique'],
        ];

        // Vider la table d'abord pour éviter les doublons
        DB::table('matieres')->truncate();
        
        // Puis insérer
        DB::table('matieres')->insert($matieres);
        
        $this->command->info('Matières ajoutées avec succès ! Total: ' . count($matieres));
    }
}
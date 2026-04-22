<?php
namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Gate;
use App\Models\User;

class AppServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        // Gate admin
        Gate::define('access-admin', function (User $user) {
            return $user->role === 'admin';
        });

        // Gate enseignant
        Gate::define('access-enseignant', function (User $user) {
            return $user->role === 'enseignant';
        });

        // Gate reserver — etudiant ET enseignant 
        Gate::define('reserver-cours', function (User $user) {
            return $user->role === 'etudiant' || $user->role === 'enseignant';
        });

        // Gate publier demande — etudiant ET enseignant 
        Gate::define('publier-demande', function (User $user){
            return $user->role === 'etudiant' || $user->role === 'enseignant';
        });

        // Gate laisser avis — etudiant ET enseignant
        Gate::define('laisser-avis', function (User $user){
            return $user->role === 'etudiant' || $user->role === 'enseignant';
        });

        // Gate envoyer offre — enseignant seulement
        Gate::define('envoyer-offre', function (User $user){
            return $user->role === 'enseignant';
        });

        // Gate valider profil — admin seulement
        Gate::define('valider-profil', function (User $user){
            return $user->role === 'admin';
        });
    }
}
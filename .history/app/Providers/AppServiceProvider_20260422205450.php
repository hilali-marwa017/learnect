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
        Gate::define('access-admin', function (User $user){
            return $user->role === 'admin';
        });

        // Gate enseignant
        Gate::define('access-enseignant', function (User $user){
            return $user->role === 'enseignant';
        });

        // Gate étudiant
        Gate::define('access-etudiant', function (User $user){
            return $user->role === 'etudiant';
        });

        // Gate valider profil
        Gate::define('valider-profil', function (User $user) {
            return $user->role === 'admin';
        });

        // Gate réserver cours
        Gate::define('reserver-cours', function (User $user) {
            return $user->role === 'etudiant';
        });

        // Gate publier demande
        Gate::define('publier-demande', function (User $user) {
            return $user->role === 'etudiant';
        });

        // Gate envoyer offre
        Gate::define('envoyer-offre', function (User $user) {
            return $user->role === 'enseignant';
        });

        // Gate laisser avis
        Gate::define('laisser-avis', function (User $user) {
            return $user->role === 'etudiant';
        });
    }
}
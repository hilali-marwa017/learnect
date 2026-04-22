<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Gate;
use App\Models\User;

class AppServiceProvider extends ServiceProvider
{
  public function boot():void{
    Gate::define ('access-admin',function(User $user){
        return $user->role === 'admin';

    });
    Gate::define ('access-enseignant',function(User $user){
        return $user->role === 'enseignant';

    });
    Gate::define ('access-',function(User $user){
        return $user->role === 'enseignant';

    });
  }

    
}

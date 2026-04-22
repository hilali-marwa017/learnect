<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\

class AppServiceProvider extends ServiceProvider
{
  public function boot():void{
    Gate::define ('access-admin',function(User $user){

    });
  }

    
}

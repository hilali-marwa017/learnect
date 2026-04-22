<?php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RoleMiddleware
{ /* $request = obje */
    public function handle(Request $request, Closure $next , string $role){

    }
    
}
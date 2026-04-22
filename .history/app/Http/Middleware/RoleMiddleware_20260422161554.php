<?php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RoleMiddleware
{ /* $request = object qui contient tous les info d'une demande d'un (user) */
    /* $next = function definie dans laravel =>if everything good pass  (middlware accept and then go to the controller)*/
    public function handle(Request $request, Closure $next , string $role /* $role ==> route */){
        if(!Auth::check() || Auth::user()->role !==$role){
            return response()->json([
                'message' => 'Accès refusé !'
            ],403);
        }

        return $next($request);

    }
    
}
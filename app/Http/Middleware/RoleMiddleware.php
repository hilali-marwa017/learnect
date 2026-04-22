<?php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RoleMiddleware
{
    public function handle(Request $request, Closure $next, string $role)
    {
        // Si pas connecté ou pas le bon rôle → refuser
        if (!Auth::check() || Auth::user()->role !== $role) {
            return response()->json([
                'message' => 'Accès refusé !'
            ], 403);
        }

        // Laisser passer la requête
        return $next($request);
    }
}
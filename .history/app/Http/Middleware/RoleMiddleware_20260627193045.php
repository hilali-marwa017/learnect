<?php

namespace App\Http\Middleware;

/* Middleware pour verifier si user est connectee et verifier son role */
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RoleMiddleware
{
    public function handle(Request $request, Closure $next, string $role)
    {
        /* $request = object qui contient tous les info d'une demande d'un (user) */
        /* $next = function definie dans laravel => if everything good pass (middlware accept and then go to the controller) */

        // si pas connectee → refuser
        if (!Auth::check()) {
            return response()->json([
                'message' => 'Non authentifié !'
            ], 401);
        }

        $user = Auth::user();

        // Si le role demandee est 'etudiant', on autorise aussi les 'enseignant'
        if ($role === 'etudiant') {
            if ($user->role !== 'etudiant' && $user->role !== 'enseignant') {
                return response()->json([
                    'message' => 'Accès refusé !'
                ], 403);
            }
        } else{
            // Pour les autres roles (enseignant, admin)te
            if ($user->role !== $role) {
                return response()->json([
                    'message' => 'Accès refusé !'
                ], 403);
            }
        }

        return $next($request);
    }
}
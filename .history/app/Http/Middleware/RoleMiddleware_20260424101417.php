<?php
namespace App\Http\Middleware;  /* role du middlware (check the user if connected nd who is he (role) */
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RoleMiddleware
{
    public function handle(Request $request, Closure $next, string $role){/* $request = object qui contient tous les info d'une demande d'un (user) */
    /* $next = function definie dans laravel =>if everything good pass  (middlware accept and then go to the controller)*/ 

        // Si pas connectee → refuser
        if (!Auth::check()) {
            return response()->json([
                'message' => 'Non authentifié !'
            ], 401);
        }
        $user = Auth::user();
        // Enseignant peut aussi reserver comme etudiant
        if ($role === 'etudiant'){
            if ($user->role !== 'etudiant' && $user->role !== 'enseignant'){
                return response()->json([
                    'message'=>'Accès refusé !'
                ],403);
            }
        } else {
            if ($user->role !== $role) {
                return response()->json([
                    'message'=>'Accès refusé !'
                ], 403);
            }
        }
        return $next($request);
    }
}
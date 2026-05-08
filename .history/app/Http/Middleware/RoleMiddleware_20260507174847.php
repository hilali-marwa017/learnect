<?php
// app/Http/Middleware/RoleMiddleware.php
namespace App\Http\Middleware; /* role du middlware (check the user if connected nd who is he (role) */

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RoleMiddleware
{
    public function handle(Request $request, Closure $next, string $role){//$next = 
        $user = Auth::user();

        if (!$user){
            return response()->json([
                'message' => 'Non authentifié !'
                ],401);
        }

        // admin
        if ($role === 'admin' && $user->role === 'admin'){
            return $next($request);
        }

        // Enseignant — role OU can_teach
        if ($role === 'enseignant' && ($user->role === 'enseignant' || $user->can_teach)){
            return $next($request);
        }

        // Etudiant — role OU can_learn
        if ($role === 'etudiant' && ($user->role === 'etudiant' || $user->can_learn)){
            return $next($request);
        }

        return response()->json([
            'message' => 'Accès refusé !'
            ],403);
    }
}
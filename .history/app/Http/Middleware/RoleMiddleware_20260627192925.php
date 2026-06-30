<?php
namespace App\Http\Middleware;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RoleMiddleware
{
    public function handle(Request $request, Closure $next, string $role){
        if (!Auth::check()) {
            return response()->json(['message'=>'Non authentifié !'],401); // ✅ corrigé
        }
        $user = Auth::user();

        if ($role === 'etudiant'){
            if ($user->role !== 'etudiant' && $user->role !== 'enseignant'){
                return response()->json(['message'=>'Accès refusé !'],403);
            }
        } else {
            if ($user->role !== $role) {
                return response()->json(['message'=>'Accès refusé !'],403);
            }
        }
        return $next($request);
    }
}
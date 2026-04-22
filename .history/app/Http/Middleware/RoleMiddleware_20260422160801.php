<?php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RoleMiddleware
{ /* $request = object  */
    public function handle(Request $request, Closure $next , string $role){

    }
    
}
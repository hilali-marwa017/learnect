<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php', //charge les routes API
        commands: __DIR__.'/../routes/console.php',
        health: '/up', ce endpoint sert à vérifier si l’application fonctionne correctement
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->api(prepend:[\Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,]);
        $middleware->alias(['role'=>\App\Http\Middleware\RoleMiddleware::class]);
        $middleware->alias(['role'=>\App\Http\Middleware\RoleMiddleware::class]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();

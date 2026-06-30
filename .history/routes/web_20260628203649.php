<?php

use Illuminate\Support\Facades\Storage;

Route::get('/storage/{path}', function ($path) {
    if (!Storage::disk('public')->exists($path)) {
        abort(404);
    }

    return response()->file(
        Storage::disk('public')->path($path)
    );
})->where('path', '.*');
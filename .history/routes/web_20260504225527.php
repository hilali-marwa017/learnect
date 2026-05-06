<?php

use App\Http\Controllers\Api\OffreController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

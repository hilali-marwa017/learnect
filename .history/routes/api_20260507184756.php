<?php
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\EnseignantController;
use App\Http\Controllers\Api\EtudiantController;
use App\Http\Controllers\Api\CreneauController;
use App\Http\Controllers\Api\DemandeController;
use App\Http\Controllers\Api\OffreController;
use App\Http\Controllers\Api\ReservationController;
use App\Http\Controllers\Api\AvisController;
use App\Http\Controllers\Api\MessageController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\PaiementController;
use App\Http\Controllers\Api\AdminController;


// auth
Route::post('/register',[AuthController::class,'register']);
Route::post('/login',[AuthController::class,'login']);

// enseignants
Route::get('/enseignants',[EnseignantController::class,'index']);
Route::get('/enseignants/{id}',[EnseignantController::class,'show']);
Route::get('/enseignants/{id}/avis',[AvisController::class,'index']);
Route::get('/enseignants/{id}/creneaux',[CreneauController::class,'index']);

/*
|--------------------------------------------------------------------------
| ROUTES PROTEGEES
|--------------------------------------------------------------------------
*/

Route::middleware('auth:sanctum')->group(function(){

    // auth controller
    Route::post('/logout',[AuthController::class,'logout']);
    Route::get('/me',[AuthController::class,'me']);

    // notification controller
    Route::get('/notifications',[NotificationController::class,'index']);
    Route::get('/notifications/unread',[NotificationController::class,'unread']);
    Route::put('/notifications/{id}/read',[NotificationController::class,'markRead']);
    Route::put('/notifications/read-all',[NotificationController::class,'markAllRead']);
    Route::delete('/notifications/{notification}',[NotificationController::class,'destroy']);

    // message controller
    Route::get('/conversations',[MessageController::class,'mesConversations']);
    Route::get('/conversations/{id_reservation}/messages',[MessageController::class,'index']);
    Route::post('/messages',[MessageController::class,'store']);
    Route::delete('/messages/{message}',[MessageController::class,'destroy']);

    /*
    |--------------------------------------------------------------------------
    | ETUDIANT + ENSEIGNANT (can learn)
    |--------------------------------------------------------------------------
    */

    Route::middleware('role:etudiant')->group(function(){

        // etudiant controller
        Route::get('/dashboard',[EtudiantController::class,'dashboard']);
        Route::get('/etudiant/profile',[EtudiantController::class,'show']);
        Route::put('/etudiant/profile',[EtudiantController::class,'update']);
        Route::post('/etudiant/photo',[EtudiantController::class,'uploadPhoto']);

        // reservation controller
        Route::get('/reservations',[ReservationController::class,'index']);
        Route::post('/reservations',[ReservationController::class,'store']);
        Route::put('/reservations/{id}/paiement',[ReservationController::class,'confirmerPaiement']);
        Route::delete('/reservations/{id}',[ReservationController::class,'destroy']);

        // demande controller
        Route::get('/demandes',[DemandeController::class,'index']);
        Route::get('/mes-demandes',[DemandeController::class,'mesDemandes']);
        Route::post('/demandes',[DemandeController::class,'store']);
        Route::delete('/demandes/{id}',[DemandeController::class,'destroy']);

        // offre controller
        Route::get('/demandes/{id}/offres',[OffreController::class,'index']);
        Route::put('/offres/{id}/accepter',[OffreController::class,'accepter']);
        Route::put('/offres/{id}/refuser',[OffreController::class,'refuser']);

        // avis controller
        Route::post('/avis',[AvisController::class,'store']);
        Route::delete('/avis/{id}',[AvisController::class,'destroy']);

        // paiement controller
        Route::get('/paiements',[PaiementController::class,'index']);
        Route::get('/paiements/{id}',[PaiementController::class,'show']);
    });

    /*
    |--------------------------------------------------------------------------
    | ENSEIGNANT
    |--------------------------------------------------------------------------
    */

    Route::middleware('role:enseignant')->group(function(){

        // enseignant controller
        Route::get('/teacher/dashboard',[EnseignantController::class,'dashboard']);
        Route::post('/enseignant/complete-profile',[EnseignantController::class,'completeProfile']);
        Route::put('/enseignant/profile',[EnseignantController::class,'update']);
        Route::post('/enseignant/photo',[EnseignantController::class,'uploadPhoto']);
        Route::post('/enseignant/documents',[EnseignantController::class,'uploadDocuments']);

        // creneau controller
        Route::post('/creneaux',[CreneauController::class,'store']);
        Route::put('/creneaux/{id}',[CreneauController::class,'update']);
        Route::delete('/creneaux/{id}',[CreneauController::class,'destroy']);

        // offre controller
        Route::get('/mes-offres',[OffreController::class,'mesOffres']);
        Route::post('/offres',[OffreController::class,'store']);

        // reservation controller
        Route::get('/teacher/reservations',[ReservationController::class,'mesReservationsEnseignant']);

        // paiement controller
        Route::get('/teacher/revenus',[PaiementController::class,'revenusEnseignant']);
    });

    /*
    |--------------------------------------------------------------------------
    | ADMIN
    |--------------------------------------------------------------------------
    */

    Route::middleware('role:admin')->group(function(){

        // admin controller
        Route::get('/admin/stats',[AdminController::class,'stats']);

        // users
        Route::get('/admin/users',[AdminController::class,'users']);
        Route::put('/admin/users/{user}/bloquer',[AdminController::class,'bloquer']);
        Route::put('/admin/users/{user}/debloquer',[AdminController::class,'debloquer']);
        Route::delete('/admin/users/{user}',[AdminController::class,'destroy']);

        // validation enseignants
        Route::get('/admin/enseignants/attente',[AdminController::class,'enseignantsEnAttente']);
        Route::put('/admin/enseignants/{enseignant}/valider',[AdminController::class,'validerEnseignant']);
        Route::put('/admin/enseignants/{enseignant}/refuser',[AdminController::class,'refuserEnseignant']);

        // gestion contenu
        Route::delete('/admin/avis/{avis}',[AdminController::class,'supprimerAvis']);
        Route::get('/admin/demandes',[AdminController::class,'demandes']);
        Route::get('/admin/reservations',[AdminController::class,'reservations']);
        Route::get('/admin/paiements',[AdminController::class,'paiements']);

        // paiement controller
        Route::get('/admin/paiements/stats',[PaiementController::class,'adminIndex']);
    });
});
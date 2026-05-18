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
use App\Http\Controllers\Api\MatiereController;
use App\Http\Controllers\Api\SignalementController;
use App\Http\Controllers\Api\OtpVerificationController;

// ═══════════════════════════════════
// PUBLIQUES
// ═══════════════════════════════════

Route::post('/register',[AuthController::class,'register']);
Route::post('/login',[AuthController::class,'login']);

// ✅ Matieres — public
Route::get('/matieres',[MatiereController::class,'index']);

// ✅ OTP — public car user pas encore connecte
Route::prefix('otp')->group(function(){
    Route::post('/envoyer',[OtpVerificationController::class,'envoyer']);
    Route::post('/verifier',[OtpVerificationController::class,'verifier']);
    Route::post('/renvoyer',[OtpVerificationController::class,'renvoyer']);
});

// Enseignants — public
Route::prefix('enseignants')->group(function(){
    Route::get('/',[EnseignantController::class,'index']);
    Route::get('/{id}',[EnseignantController::class,'show']);
    Route::get('/{id}/avis',[AvisController::class,'index']);
    Route::get('/{id}/creneaux',[CreneauController::class,'index']);
});

// ═══════════════════════════════════
// PROTEGEES — token obligatoire
// ═══════════════════════════════════

Route::middleware('auth:sanctum')->group(function(){

    // Auth
    Route::post('/logout',[AuthController::class,'logout']);
    Route::get('/me',[AuthController::class,'me']);

    // ✅ Signalement — tout user connecte
    Route::post('/signalements',[SignalementController::class,'store']);

    // Notifications
    Route::prefix('notifications')->group(function(){
        Route::get('/',[NotificationController::class,'index']);
        Route::get('/unread',[NotificationController::class,'unread']);
        Route::put('/{id}/read',[NotificationController::class,'markRead']);
        Route::put('/read-all',[NotificationController::class,'markAllRead']);
        Route::delete('/{notification}',[NotificationController::class,'destroy']);
    });

    // Messages
    Route::prefix('messages')->group(function(){
        Route::get('/conversations',[MessageController::class,'mesConversations']);
        Route::get('/conversations/{id_reservation}',[MessageController::class,'index']);
        Route::post('/',[MessageController::class,'store']);
        Route::delete('/{message}',[MessageController::class,'destroy']);
    });

    // ═══════════════════════════════
    // ETUDIANT + ENSEIGNANT (can_learn)
    // ═══════════════════════════════
    Route::middleware('role:etudiant')->group(function(){

        Route::get('/dashboard',[EtudiantController::class,'dashboard']);
        Route::get('/etudiant/profile',[EtudiantController::class,'show']);
        Route::put('/etudiant/profile',[EtudiantController::class,'update']);
        Route::post('/etudiant/photo',[EtudiantController::class,'uploadPhoto']);

        // Reservations
        Route::prefix('reservations')->group(function(){
            Route::get('/',[ReservationController::class,'index']);
            Route::post('/',[ReservationController::class,'store']);
            Route::put('/{id}/paiement',[ReservationController::class,'confirmerPaiement']);
            Route::put('/{id}/terminer',[ReservationController::class,'terminer']); // ✅ nouveau
            Route::delete('/{id}',[ReservationController::class,'destroy']);
        });

        // Demandes
        Route::prefix('demandes')->group(function(){
            Route::get('/',[DemandeController::class,'index']);
            Route::get('/mes-demandes',[DemandeController::class,'mesDemandes']);
            Route::post('/',[DemandeController::class,'store']);
            Route::delete('/{id}',[DemandeController::class,'destroy']);
        });

        // Offres etudiant
        Route::prefix('offres')->group(function(){
            Route::get('/demande/{id_demande}',[OffreController::class,'index']); // ✅ corrige
            Route::put('/{id}/accepter',[OffreController::class,'accepter']);
            Route::put('/{id}/refuser',[OffreController::class,'refuser']);
        });

        // Avis
        Route::prefix('avis')->group(function(){
            Route::post('/',[AvisController::class,'store']);
            Route::delete('/{id}',[AvisController::class,'destroy']);
        });

        // Paiements
        Route::prefix('paiements')->group(function(){
            Route::get('/',[PaiementController::class,'index']);
            Route::get('/{id}',[PaiementController::class,'show']);
        });
    });

    // ═══════════════════════════════
    // ENSEIGNANT
    // ═══════════════════════════════
    Route::middleware('role:enseignant')->group(function(){

        Route::get('/teacher/dashboard',[EnseignantController::class,'dashboard']);
        Route::get('/teacher/reservations',[ReservationController::class,'mesReservationsEnseignant']);
        Route::get('/teacher/revenus',[PaiementController::class,'revenusEnseignant']);

        Route::prefix('enseignant')->group(function(){
            Route::post('/complete-profile',[EnseignantController::class,'completeProfile']);
            Route::put('/profile',[EnseignantController::class,'update']);
            Route::post('/photo',[EnseignantController::class,'uploadPhoto']);
            Route::post('/documents',[EnseignantController::class,'uploadDocuments']);
        });

        // Creneaux
        Route::prefix('creneaux')->group(function(){
            Route::post('/',[CreneauController::class,'store']);
            Route::put('/{id}',[CreneauController::class,'update']);
            Route::delete('/{id}',[CreneauController::class,'destroy']);
        });

        // Offres enseignant
        Route::prefix('offres')->group(function(){
            Route::get('/mes-offres',[OffreController::class,'mesOffres']);
            Route::post('/',[OffreController::class,'store']);
        });
    });

    // ═══════════════════════════════
    // ADMIN
    // ═══════════════════════════════
    Route::middleware('role:admin')->prefix('admin')->group(function(){

        Route::get('/stats',[AdminController::class,'stats']);

        // Users
        Route::get('/users',[AdminController::class,'users']);
        Route::put('/users/{user}/bloquer',[AdminController::class,'bloquer']);
        Route::put('/users/{user}/debloquer',[AdminController::class,'debloquer']);
        Route::delete('/users/{user}',[AdminController::class,'destroy']);

        // enseignants validation
        Route::get('/enseignants/attente',[AdminController::class,'enseignantsEnAttente']);
        Route::put('/enseignants/{enseignant}/valider',[AdminController::class,'validerEnseignant']);
        Route::put('/enseignants/{enseignant}/refuser',[AdminController::class,'refuserEnseignant']);

        //contenu 
        Route::delete('/avis/{avis}',[AdminController::class,'supprimerAvis']);
        Route::get('/demandes',[AdminController::class,'demandes']);
        Route::get('/reservations',[AdminController::class,'reservations']);

        //stats , paiement
        Route::get('/paiements/stats',[PaiementController::class,'adminIndex']);
        Route::get('/paiements',[AdminController::class,'paiements']);

        //signalements admin
        Route::get('/signalements',[SignalementController::class,'index']);
        Route::put('/signalements/{signalement}/traiter',[SignalementController::class,'traiter']);
        Route::delete('/signalements/{signalement}',[SignalementController::class,'destroy']);
    });
});
<?php

Route::middleware('auth:sanctum')->group(function () {

    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    Route::post('/signalements', [SignalementController::class, 'store']);

    // ✅ NOUVEAU : peut-noter doit etre protege (necessite auth)
    Route::get('/enseignants/{id}/peut-noter', [AvisController::class, 'peutNoter']);

    Route::prefix('notifications')->group(function () {
        Route::get('/', [NotificationController::class, 'index']);
        Route::get('/unread', [NotificationController::class, 'unread']);
        Route::put('/read-all', [NotificationController::class, 'markAllRead']);
        Route::put('/{id}/read', [NotificationController::class, 'markRead']);
        Route::delete('/{notification}', [NotificationController::class, 'destroy']);
    });

    Route::prefix('messages')->group(function () {
        Route::get('/conversations', [MessageController::class, 'mesConversations']);
        Route::get('/non-lus', [MessageController::class, 'nonLus']);
        Route::get('/conversations/{id_reservation}', [MessageController::class, 'index']);
        Route::post('/', [MessageController::class, 'store']);
        Route::put('/{id_reservation}/lu', [MessageController::class, 'marquerCommeLu']);
        Route::delete('/{message}', [MessageController::class, 'destroy']);
    });

    // ETUDIANT
    Route::middleware('role:etudiant')->group(function () {

        Route::get('/dashboard', [EtudiantController::class, 'dashboard']);

        Route::prefix('etudiant')->group(function () {
            Route::get('/profile', [EtudiantController::class, 'show']);
            Route::put('/profile', [EtudiantController::class, 'update']);
            Route::post('/photo', [EtudiantController::class, 'uploadPhoto']);
        });

        Route::prefix('reservations')->group(function () {
            Route::get('/', [ReservationController::class, 'index']);
            Route::post('/', [ReservationController::class, 'store']);
            Route::put('/{id}/paiement', [ReservationController::class, 'confirmerPaiement']);
            Route::put('/{id}/terminer', [ReservationController::class, 'terminer']);
            Route::delete('/{id}', [ReservationController::class, 'destroy']);
        });

        Route::prefix('demandes')->group(function () {
            Route::get('/', [DemandeController::class, 'index']);
            Route::get('/mes-demandes', [DemandeController::class, 'mesDemandes']);
            Route::post('/', [DemandeController::class, 'store']);
            Route::delete('/{id}', [DemandeController::class, 'destroy']);
        });

        Route::prefix('offres')->group(function () {
            Route::get('/demande/{id_demande}', [OffreController::class, 'index']);
            Route::put('/{id}/accepter', [OffreController::class, 'accepter']);
            Route::put('/{id}/refuser', [OffreController::class, 'refuser']);
        });

        Route::prefix('avis')->group(function () {
            Route::post('/', [AvisController::class, 'store']);
            Route::delete('/{id}', [AvisController::class, 'destroy']);
        });

        Route::prefix('paiements')->group(function () {
            Route::get('/', [PaiementController::class, 'index']);
            Route::get('/{id}', [PaiementController::class, 'show']);
        });
    });

    // ENSEIGNANT
    Route::middleware('role:enseignant')->group(function () {

        Route::prefix('enseignant')->group(function () {
            Route::get('/dashboard', [EnseignantController::class, 'dashboard']);
            Route::get('/reservations', [ReservationController::class, 'mesReservationsEnseignant']);
            Route::post('/complete-profile', [EnseignantController::class, 'completeProfile']);
            Route::put('/profil', [EnseignantController::class, 'update']);
            Route::post('/photo', [EnseignantController::class, 'uploadPhoto']);
            Route::post('/documents', [EnseignantController::class, 'uploadDocuments']);
        });

        Route::prefix('paiements')->group(function () {
            Route::get('/enseignant/revenus', [PaiementController::class, 'revenusEnseignant']);
        });

        Route::prefix('creneaux')->group(function () {
            Route::post('/', [CreneauController::class, 'store']);
            Route::put('/{id}', [CreneauController::class, 'update']);
            Route::delete('/{id}', [CreneauController::class, 'destroy']);
        });

        Route::get('/demandes/disponibles', [DemandeController::class, 'index']);

        Route::prefix('offres')->group(function () {
            Route::get('/mes-offres', [OffreController::class, 'mesOffres']);
            Route::post('/', [OffreController::class, 'store']);
        });
    });

    // ADMIN
    Route::middleware('role:admin')->prefix('admin')->group(function () {
        Route::get('/stats', [AdminController::class, 'stats']);
        Route::get('/users', [AdminController::class, 'Users']);
        Route::put('/users/{user}/bloquer', [AdminController::class, 'bloquer']);
        Route::put('/users/{user}/debloquer', [AdminController::class, 'debloquer']);
        Route::delete('/users/{user}', [AdminController::class, 'destroy']);
        Route::get('/enseignants/attente', [AdminController::class, 'enseignantsEnAttente']);
        Route::put('/enseignants/{enseignant}/valider', [AdminController::class, 'validerEnseignant']);
        Route::put('/enseignants/{enseignant}/refuser', [AdminController::class, 'refuserEnseignant']);
        Route::delete('/avis/{avis}', [AdminController::class, 'supprimerAvis']);
        Route::get('/demandes', [AdminController::class, 'demandes']);
        Route::get('/reservations', [AdminController::class, 'reservations']);
        Route::get('/paiements', [AdminController::class, 'paiements']);
        Route::get('/signalements', [SignalementController::class, 'index']);
        Route::put('/signalements/{signalement}/traiter', [SignalementController::class, 'traiter']);
        Route::delete('/signalements/{signalement}', [SignalementController::class, 'destroy']);
    });
});
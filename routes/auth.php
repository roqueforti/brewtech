<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
// ... imports lainnya

Route::middleware('guest')->group(function () {
    // --- KOMENTARI BAGIAN INI ---
    // Route::get('login', [AuthenticatedSessionController::class, 'create'])
    //             ->name('login');
    // ----------------------------

    // Biarkan route register, forgot password, dll tetap ada
    Route::get('register', [RegisteredUserController::class, 'create'])
                ->name('register');
    
    Route::post('register', [RegisteredUserController::class, 'store']);
    // ... dst
});

// ...
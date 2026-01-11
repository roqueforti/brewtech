<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;
use Illuminate\Support\Facades\Route;
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

Route::middleware('guest')->group(function () {
    // 1. Rute untuk MENAMPILKAN halaman login (GET)
    Route::get('pengajar/login', [AuthenticatedSessionController::class, 'create'])
        ->name('pengajar.login');

    // 2. Rute untuk MEMPROSES data login (POST) -> INI YANG DICARI ERROR TADI
    Route::post('pengajar/login', [AuthenticatedSessionController::class, 'store'])
        ->name('pengajar.login.store');
});
// ...
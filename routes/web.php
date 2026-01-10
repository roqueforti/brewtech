<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\StudentAuthController;
use App\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

// =========================================================================
// 1. HALAMAN DEPAN (Redirect ke Login)
// =========================================================================
Route::get('/', function () {
    return redirect()->route('login');
});

// =========================================================================
// 2. AUTHENTICATION (Login Kiosk & Pengajar)
// =========================================================================

// Halaman Login (Menampilkan Pilihan Kelas)
Route::get('/login', [StudentAuthController::class, 'showLoginForm'])
    ->middleware('guest')
    ->name('login');

// Proses Login Siswa (Tanpa Password, hanya ID)
Route::post('/login/student', [StudentAuthController::class, 'login'])
    ->middleware('guest')
    ->name('login.student');

// =========================================================================
// 3. AREA PESERTA (Wajib Login sebagai Student/User)
// =========================================================================
Route::middleware(['auth', 'verified'])->prefix('peserta')->group(function () {

    // Dashboard Peserta
    // Menggunakan Controller agar data Workshop, Statistik, dan User terkirim lengkap
    Route::get('/dashboard', [DashboardController::class, 'indexPeserta'])
        ->name('dashboard.peserta');

    // Halaman Alur Workshop (Materi)
    // Ganti route workshop-flow yang lama dengan ini:
    Route::get('/workshop/{id}', [WorkshopController::class, 'show'])->name('workshop.play');
    Route::get('/api/workshop/{id}/steps', [WorkshopController::class, 'getSteps']);
    Route::get('/api/workshop/{id}/quiz/{type}', [WorkshopController::class, 'getQuiz']);
    Route::post('/api/workshop/{id}/quiz/submit', [WorkshopController::class, 'submitQuiz']);
    Route::post('/api/workshop/{id}/praktikum/complete', [WorkshopController::class, 'completePraktikum']);
    Route::post('/api/workshop/{id}/photo', [WorkshopController::class, 'submitPhoto']);
});

// =========================================================================
// 4. AREA PENGAJAR (Wajib Login sebagai Instructor)
// =========================================================================
Route::middleware(['auth', 'verified'])->prefix('pengajar')->group(function () {

    // Dashboard Pengajar
    Route::get('/dashboard', function () {
        return Inertia::render('Pengajar/Dashboard');
    })->name('dashboard.pengajar');

    // Menu Manajemen & Analisis
    Route::get('/analisis-spk', function () {
        return Inertia::render('Pengajar/AnalisisSPK');
    })->name('analisis.spk');

    Route::get('/manajemen-kelas', function () {
        return Inertia::render('Pengajar/ManajemenKelas');
    })->name('manajemen.kelas');

    Route::get('/manajemen-modul', function () {
        return Inertia::render('Pengajar/ManajemenModul');
    })->name('manajemen.modul');

    Route::get('/manajemen-peserta', function () {
        return Inertia::render('Pengajar/ManajemenPeserta');
    })->name('manajemen.peserta');
});

Route::get('/dashboard', function () {
    return redirect()->route('dashboard.peserta');
})->middleware(['auth', 'verified']);

Route::middleware(['auth', 'verified'])->prefix('peserta')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'indexPeserta'])->name('dashboard.peserta');
    Route::get('/workshop-flow', [DashboardController::class, 'workshopFlow'])->name('workshop.flow');
    Route::get('/nilai-spk', [DashboardController::class, 'nilaiSpk'])->name('nilai.spk');
    Route::get('/profil', [DashboardController::class, 'profil'])->name('profil.peserta');
});

Route::post('/logout', function (\Illuminate\Http\Request $request) {
    Auth::logout();

    $request->session()->invalidate();

    $request->session()->regenerateToken();

    return redirect('/');
})->name('logout');
// =========================================================================
// 5. LOAD AUTH ROUTES BAWAAN (Logout, Reset Password, dll)
// =========================================================================
require __DIR__ . '/auth.php';
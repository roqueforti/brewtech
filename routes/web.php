<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\StudentAuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\WorkshopController; // Pastikan controller ini ada/dibuat
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

// Proses Logout
Route::post('/logout', function (\Illuminate\Http\Request $request) {
    Auth::logout();
    $request->session()->invalidate();
    $request->session()->regenerateToken();
    return redirect('/');
})->name('logout');

// =========================================================================
// 3. AREA PESERTA (Wajib Login sebagai Student/User)
// =========================================================================
Route::middleware(['auth', 'verified'])->prefix('peserta')->group(function () {

    // --- Dashboard & Profil ---
    Route::get('/dashboard', [DashboardController::class, 'indexPeserta'])->name('dashboard.peserta');
    Route::get('/profil', [DashboardController::class, 'profil'])->name('profil.peserta');
    
    // --- Rapor & SPK ---
    Route::get('/nilai-spk', [DashboardController::class, 'nilaiSpk'])->name('nilai.spk');

    // --- Workshop Flow & API (Player) ---
    // Redirector sederhana
    Route::get('/workshop-flow', [DashboardController::class, 'workshopFlow'])->name('workshop.flow');
    
    // Logika Player (Mengarah ke WorkshopController)
    Route::get('/workshop/{id}', [WorkshopController::class, 'show'])->name('workshop.play');
    
    // API Endpoints untuk Workshop Interaktif
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

    // Dashboard Utama Pengajar (Statistik & Grading)
    Route::get('/dashboard', [DashboardController::class, 'indexPengajar'])->name('dashboard.pengajar');
    
    // Aksi Grading (ACC/Tolak Tugas)
    Route::post('/grade', [DashboardController::class, 'gradeSubmission'])->name('pengajar.grade');

    // Menu Manajemen Lainnya (Placeholder Inertia)
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

// =========================================================================
// 5. REDIRECT UMUM
// =========================================================================
// Jika akses /dashboard, cek role lalu lempar ke tempat yang benar
Route::get('/dashboard', function () {
    $user = Auth::user();
    if ($user->role === 'instructor') {
        return redirect()->route('dashboard.pengajar');
    }
    return redirect()->route('dashboard.peserta');
})->middleware(['auth', 'verified']);

// Load routes auth default (jika diperlukan untuk fitur reset password dsb)
require __DIR__ . '/auth.php';
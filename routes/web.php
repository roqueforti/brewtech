<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\StudentAuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\WorkshopController; 
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
// 2. AUTHENTICATION
// =========================================================================

Route::get('/login', [StudentAuthController::class, 'showLoginForm'])
    ->middleware('guest')
    ->name('login');

Route::post('/login/student', [StudentAuthController::class, 'login'])
    ->middleware('guest')
    ->name('login.student');

Route::post('/logout', function (\Illuminate\Http\Request $request) {
    Auth::logout();
    $request->session()->invalidate();
    $request->session()->regenerateToken();
    return redirect('/');
})->name('logout');

// =========================================================================
// 3. AREA PESERTA (Student)
// =========================================================================
Route::middleware(['auth', 'verified'])->prefix('peserta')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'indexPeserta'])->name('dashboard.peserta');
    Route::get('/profil', [DashboardController::class, 'profil'])->name('profil.peserta');
    Route::get('/nilai-spk', [DashboardController::class, 'nilaiSpk'])->name('nilai.spk');
    Route::get('/workshop-flow', [DashboardController::class, 'workshopFlow'])->name('workshop.flow');
    Route::get('/workshop/{id}', [WorkshopController::class, 'show'])->name('workshop.play');
    
    // API Endpoints
    Route::get('/api/workshop/{id}/steps', [WorkshopController::class, 'getSteps']);
    Route::get('/api/workshop/{id}/quiz/{type}', [WorkshopController::class, 'getQuiz']);
    Route::post('/api/workshop/{id}/quiz/submit', [WorkshopController::class, 'submitQuiz']);
    Route::post('/api/workshop/{id}/praktikum/complete', [WorkshopController::class, 'completePraktikum']);
    Route::post('/api/workshop/{id}/photo', [WorkshopController::class, 'submitPhoto']);
});

// =========================================================================
// 4. AREA PENGAJAR (Instructor)
// =========================================================================
Route::middleware(['auth', 'verified'])->prefix('pengajar')->group(function () {

    // 1. Dashboard Utama
    Route::get('/dashboard', [DashboardController::class, 'indexPengajar'])->name('dashboard.pengajar');
    Route::post('/grade', [DashboardController::class, 'gradeSubmission'])->name('pengajar.grade');

    // 2. Manajemen Kelas (CRUD LENGKAP)
    // ✅ READ (Tampilkan Halaman) - Ini yang sudah ada
    Route::get('/kelas', [DashboardController::class, 'kelas'])->name('pengajar.kelas');

    // ✅ CREATE (Simpan Data Baru) - INI YANG HILANG DAN BIKIN ERROR
    Route::post('/kelas', [DashboardController::class, 'storeKelas'])->name('pengajar.kelas.store'); 

    // ✅ UPDATE (Edit Data)
    Route::put('/kelas/{id}', [DashboardController::class, 'updateKelas'])->name('pengajar.kelas.update'); 

    // ✅ DELETE (Hapus Data)
    Route::delete('/kelas/{id}', [DashboardController::class, 'destroyKelas'])->name('pengajar.kelas.destroy');

    // ... (Placeholder routes lain biarkan saja) ...
    Route::get('/analisis', function () {
        return Inertia::render('Pengajar/AnalisisSPK', ['auth' => ['user' => Auth::user()]]);
    })->name('pengajar.analisis');

    Route::get('/siswa', function () {
        return Inertia::render('Pengajar/ManajemenPeserta', ['auth' => ['user' => Auth::user()]]);
    })->name('pengajar.siswa');

    Route::get('/modul', function () {
        return Inertia::render('Pengajar/ManajemenModul', ['auth' => ['user' => Auth::user()]]);
    })->name('pengajar.modul');

    Route::get('/siswa', [DashboardController::class, 'siswa'])->name('pengajar.siswa');
    Route::post('/siswa', [DashboardController::class, 'storeSiswa'])->name('pengajar.siswa.store');
    Route::put('/siswa/{id}', [DashboardController::class, 'updateSiswa'])->name('pengajar.siswa.update');
    Route::delete('/siswa/{id}', [DashboardController::class, 'destroySiswa'])->name('pengajar.siswa.destroy');
});

// =========================================================================
// 5. REDIRECT UMUM
// =========================================================================
Route::get('/dashboard', function () {
    $user = Auth::user();
    if ($user->role === 'instructor') {
        return redirect()->route('dashboard.pengajar');
    }
    return redirect()->route('dashboard.peserta');
})->middleware(['auth', 'verified']);

require __DIR__ . '/auth.php';
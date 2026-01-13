<?php

use App\Http\Controllers\ModuleController;
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
    
    // API Endpoints untuk Workshop
    Route::get('/api/workshop/{id}/steps', [WorkshopController::class, 'getSteps']);
    Route::get('/api/workshop/{id}/quiz/{type}', [WorkshopController::class, 'getQuiz']);
    Route::post('/api/workshop/{id}/quiz/submit', [WorkshopController::class, 'submitQuiz']);
    Route::post('/api/workshop/{id}/praktikum/complete', [WorkshopController::class, 'completePraktikum']);
    Route::post('/api/workshop/{id}/photo', [WorkshopController::class, 'submitPhoto']);
});

// =========================================================================
// 4. AREA PENGAJAR (Instructor)
// =========================================================================
Route::middleware(['auth', 'verified', 'role:instructor'])->prefix('pengajar')->group(function () {

    // --- A. DASHBOARD ---
    Route::get('/dashboard', [DashboardController::class, 'indexPengajar'])->name('dashboard.pengajar');
    Route::post('/grade', [DashboardController::class, 'gradeSubmission'])->name('pengajar.grade');

    // --- B. MANAJEMEN KELAS ---
    Route::get('/kelas', [DashboardController::class, 'kelas'])->name('pengajar.kelas');
    Route::post('/kelas', [DashboardController::class, 'storeKelas'])->name('pengajar.kelas.store'); 
    Route::put('/kelas/{id}', [DashboardController::class, 'updateKelas'])->name('pengajar.kelas.update'); 
    Route::delete('/kelas/{id}', [DashboardController::class, 'destroyKelas'])->name('pengajar.kelas.destroy');

    // --- C. MANAJEMEN SISWA ---
    Route::get('/siswa', [DashboardController::class, 'siswa'])->name('pengajar.siswa');
    Route::post('/siswa', [DashboardController::class, 'storeSiswa'])->name('pengajar.siswa.store');
    Route::put('/siswa/{id}', [DashboardController::class, 'updateSiswa'])->name('pengajar.siswa.update');
    Route::delete('/siswa/{id}', [DashboardController::class, 'destroySiswa'])->name('pengajar.siswa.destroy');
    // Detail Siswa (Penting untuk melihat grafik & profil lengkap)
    Route::get('/siswa/{id}', [DashboardController::class, 'showSiswa'])->name('pengajar.siswa.show');

    // --- D. ANALISIS SPK ---
    // Menggunakan Controller agar data siswa terkirim (Bukan function kosong)
    Route::get('/analisis', [DashboardController::class, 'analisis'])->name('pengajar.analisis');

    // --- E. BANK MODUL (MANAJEMEN MODUL) ---
    // Perbaikan: Hapus '/pengajar' di URL karena sudah ada di prefix group
    Route::get('/modul', [ModuleController::class, 'index'])->name('pengajar.modul.index');
    Route::post('/modul', [ModuleController::class, 'store'])->name('pengajar.modul.store');
    Route::put('/modul/{id}', [ModuleController::class, 'update'])->name('pengajar.modul.update');
    Route::delete('/modul/{id}', [ModuleController::class, 'destroy'])->name('pengajar.modul.destroy');
    // Tambahkan route ini di bawah route modul lainnya
    Route::get('/modul/{id}/edit', [ModuleController::class, 'edit'])->name('pengajar.modul.edit');
    Route::get('/modul/{id}/preview', [ModuleController::class, 'preview'])->name('pengajar.modul.preview');

});

// =========================================================================
// 5. REDIRECT UMUM (Role Based)
// =========================================================================
Route::get('/dashboard', function () {
    $user = Auth::user();
    if ($user->role === 'instructor') {
        return redirect()->route('dashboard.pengajar');
    }
    return redirect()->route('dashboard.peserta');
})->middleware(['auth', 'verified']);

require __DIR__ . '/auth.php';
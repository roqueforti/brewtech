<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\SettingController;
use App\Http\Controllers\StudentAuthController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes (FINAL FIXED)
|--------------------------------------------------------------------------
*/

// =========================================================================
// 1. HALAMAN DEPAN & AUTHENTICATION
// =========================================================================

Route::get('/', function () {
    return redirect()->route('login');
});

// Login Peserta & Pengajar
Route::middleware('guest')->group(function () {
    Route::get('/login', [StudentAuthController::class, 'showLoginForm'])->name('login');
    Route::post('/login/student', [StudentAuthController::class, 'login'])->name('login.student');
    
    Route::post('/pengajar/login', [AuthController::class, 'store'])->name('login.pengajar'); 

    Route::get('/register-pengajar', [AuthController::class, 'showRegister'])->name('register.pengajar');
    Route::post('/register-pengajar', [AuthController::class, 'storeRegister'])->name('register.pengajar.store');
});

// Logout
Route::post('/logout', function (\Illuminate\Http\Request $request) {
    Auth::logout();
    $request->session()->invalidate();
    $request->session()->regenerateToken();
    return redirect('/');
})->name('logout')->middleware('auth');


// =========================================================================
// 2. DASHBOARD REDIRECTOR
// =========================================================================
Route::get('/dashboard', [DashboardController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');


// =========================================================================
// 3. AREA PESERTA (Student)
// =========================================================================

Route::middleware(['auth', 'verified'])->prefix('peserta')->name('peserta.')->group(function () {
    // Menggunakan DashboardController
    Route::get('/dashboard', [DashboardController::class, 'indexPeserta'])->name('dashboard');
});

// ✅ FIX: RUTE PLAY (WAJIB DashboardController)
// Diletakkan di luar prefix 'name(peserta.)' agar namanya tetap 'workshop.play' sesuai Frontend
Route::middleware(['auth', 'verified'])->prefix('peserta')->group(function () {
    Route::get('/workshop/{id}/play', [DashboardController::class, 'play'])->name('workshop.play'); 
});


// =========================================================================
// 4. API ENDPOINTS (Untuk Frontend Play.tsx)
// =========================================================================
// ✅ FIX: Semua diarahkan ke DashboardController (karena logika submitQuiz dll ada disana)
Route::middleware(['auth', 'verified'])->prefix('api/workshop/{id}')->group(function () {
    Route::get('/steps', [DashboardController::class, 'getSteps']);
    Route::get('/quiz/{type}', [DashboardController::class, 'getQuiz']);
    Route::post('/quiz/submit', [DashboardController::class, 'submitQuiz'])->name('api.quiz.submit');
    Route::post('/photo', [DashboardController::class, 'submitPhoto']);
});


// =========================================================================
// 5. AREA PENGAJAR (Instructor)
// =========================================================================
Route::middleware(['auth', 'verified'])->prefix('pengajar')->name('pengajar.')->group(function () {

    // --- A. DASHBOARD ---
    Route::get('/dashboard', [DashboardController::class, 'indexPengajar'])->name('dashboard');
    Route::post('/grade', [DashboardController::class, 'gradeSubmission'])->name('grade');

    // --- B. MANAJEMEN KELAS ---
    Route::get('/kelas', [DashboardController::class, 'kelas'])->name('kelas'); 
    Route::post('/kelas', [DashboardController::class, 'storeKelas'])->name('kelas.store'); 
    Route::put('/kelas/{id}', [DashboardController::class, 'updateKelas'])->name('kelas.update'); 
    Route::delete('/kelas/{id}', [DashboardController::class, 'destroyKelas'])->name('kelas.destroy'); 
    
    // Detail Kelas
    Route::get('/kelas/{id}', [DashboardController::class, 'detailKelas'])->name('kelas.detail');
    Route::post('/kelas/{id}/modules', [DashboardController::class, 'addModuleToKelas'])->name('kelas.add-module'); 
    Route::delete('/kelas/{id}/modules/{moduleId}', [DashboardController::class, 'removeModuleFromKelas'])->name('kelas.remove-module'); 
    Route::put('/kelas/{kelasId}/modules/{moduleId}/schedule', [DashboardController::class, 'updateModuleSchedule'])->name('kelas.module.schedule');
    
    Route::post('/kelas/{id}/students', [DashboardController::class, 'addStudentToKelas'])->name('kelas.add-student');
    Route::delete('/kelas/{id}/students/{studentId}', [DashboardController::class, 'removeStudentFromKelas'])->name('kelas.remove-student');
    
    // Nilai Soft Skill
    Route::post('/nilai-soft-skill', [DashboardController::class, 'updateSoftSkill'])->name('softskill.update');

    // --- C. MANAJEMEN SISWA ---
    Route::get('/siswa', [DashboardController::class, 'siswa'])->name('siswa'); 
    Route::post('/siswa', [DashboardController::class, 'storeSiswa'])->name('siswa.store'); 
    Route::put('/siswa/{id}', [DashboardController::class, 'updateSiswa'])->name('siswa.update'); 
    Route::delete('/siswa/{id}', [DashboardController::class, 'destroySiswa'])->name('siswa.destroy'); 
    Route::get('/siswa/{id}', [DashboardController::class, 'detailSiswa'])->name('siswa.detail'); 

    // --- D. ANALISIS SPK ---
    Route::get('/analisis', [DashboardController::class, 'analisis'])->name('analisis');

    // --- E. BANK MODUL ---
    // Menggunakan DashboardController untuk CRUD Modul
    Route::get('/modul', [DashboardController::class, 'modulIndex'])->name('modul.index');
    Route::post('/modul', [DashboardController::class, 'storeModul'])->name('modul.store');
    Route::get('/modul/{id}/edit', [DashboardController::class, 'editModul'])->name('modul.edit');
    Route::put('/modul/{id}', [DashboardController::class, 'updateModul'])->name('modul.update');
    Route::delete('/modul/{id}', [DashboardController::class, 'destroyModul'])->name('modul.destroy');
    Route::get('/modul/{id}/preview', [DashboardController::class, 'previewModul'])->name('modul.preview');

    // --- F. PENGATURAN ---
    Route::get('/pengaturan', [SettingController::class, 'index'])->name('pengaturan');
    Route::post('/pengaturan', [SettingController::class, 'update'])->name('pengaturan.update');
});

require __DIR__ . '/auth.php';
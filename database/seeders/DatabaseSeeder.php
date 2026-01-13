<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Kelas;
use App\Models\Workshop;
use App\Models\StudentActivity;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // ==========================================
        // 1. INSTRUKTUR (ADMIN)
        // ==========================================
        User::create([
            'name' => 'Hilman Instructor',
            'email' => 'admin@brewtech.com',
            'password' => Hash::make('password'),
            'role' => 'instructor',
        ]);

        // ==========================================
        // 2. KELAS DUMMY
        // ==========================================
        $kelasA = Kelas::create([
            'nama' => 'Manual Brew Basic',
            'emoji' => '☕',
            'pelatih' => 'Hilman',
            'periode' => 'Jan - Mar 2026',
            'deskripsi' => 'Kelas dasar teknik seduh manual V60.',
            'theme' => 'green',
            'status' => 'Aktif'
        ]);

        $kelasB = Kelas::create([
            'nama' => 'Espresso Master',
            'emoji' => '🚀',
            'pelatih' => 'Budi',
            'periode' => 'Feb - Apr 2026',
            'deskripsi' => 'Teknik kalibrasi espresso lanjutan.',
            'theme' => 'yellow',
            'status' => 'Aktif'
        ]);

        // ==========================================
        // 3. MASTER WORKSHOPS (MATERI)
        // ==========================================
        $ws1 = Workshop::create(['title' => 'Pengenalan Biji Kopi', 'description' => 'Memahami Arabica vs Robusta']);
        $ws2 = Workshop::create(['title' => 'Teknik Grinding', 'description' => 'Kalibrasi ukuran gilingan']);
        $ws3 = Workshop::create(['title' => 'Manual Brew V60', 'description' => 'Praktek seduh V60']);
        $ws4 = Workshop::create(['title' => 'Espresso Calibration', 'description' => 'Mengatur dial-in espresso']);
        $ws5 = Workshop::create(['title' => 'Latte Art Basic', 'description' => 'Teknik steaming dan pouring']);

        // ==========================================
        // 4. SISWA 1 (LENGKAP - SIAP PKL)
        // ==========================================
        $siswa1 = User::create([
            'name' => 'Rizky Barista',
            'email' => 'siswa1@brewtech.com',
            'password' => Hash::make('password'),
            'role' => 'student',
            'phone' => '081234567890',
            
            // Data Baru
            'age' => 19,
            'school_grade' => 'Kelas 12 SMALB',
            'disability' => 'Tuna Rungu', // Ada data disability
            
            'kelas_id' => $kelasA->id,
            'pre_test_score' => 45,
            'post_test_score' => 88,
            'status_pkl' => 'siap'
        ]);

        // Isi Data Workshop Siswa 1 (Agar grafik terisi)
        $siswa1->workshops()->attach([
            $ws1->id => ['status' => 'completed', 'score' => 90, 'created_at' => now()->subDays(10)],
            $ws2->id => ['status' => 'completed', 'score' => 85, 'created_at' => now()->subDays(5)],
            $ws3->id => ['status' => 'completed', 'score' => 88, 'created_at' => now()->subDays(2)],
            $ws4->id => ['status' => 'pending', 'score' => 0, 'created_at' => now()],
        ]);

        // Isi Riwayat Aktivitas Siswa 1
        StudentActivity::create(['user_id' => $siswa1->id, 'title' => 'Login ke Aplikasi', 'type' => 'login', 'created_at' => now()->subDays(10)]);
        StudentActivity::create(['user_id' => $siswa1->id, 'title' => 'Menyelesaikan Modul Biji Kopi', 'type' => 'completion', 'score' => 90, 'created_at' => now()->subDays(9)]);
        StudentActivity::create(['user_id' => $siswa1->id, 'title' => 'Menyelesaikan Quiz Grinding', 'type' => 'submission', 'score' => 85, 'created_at' => now()->subDays(5)]);

        // ==========================================
        // 5. SISWA 2 (PEMULA - DALAM PELATIHAN)
        // ==========================================
        $siswa2 = User::create([
            'name' => 'Siti Brewer',
            'email' => 'siswa2@brewtech.com',
            'password' => Hash::make('password'),
            'role' => 'student',
            'phone' => '08987654321',

            // Data Baru
            'age' => 18,
            'school_grade' => 'Kelas 11 SMA',
            'disability' => null, // Tidak ada disability
            
            'kelas_id' => $kelasB->id,
            'pre_test_score' => 30,
            'post_test_score' => 0, // Belum post test
            'status_pkl' => 'dalam_pelatihan'
        ]);

        // Isi Data Workshop Siswa 2 (Baru mulai)
        $siswa2->workshops()->attach([
            $ws1->id => ['status' => 'completed', 'score' => 75, 'created_at' => now()->subDays(1)],
            $ws2->id => ['status' => 'pending', 'score' => 0, 'created_at' => now()],
        ]);

        StudentActivity::create(['user_id' => $siswa2->id, 'title' => 'Registrasi Akun', 'type' => 'login', 'created_at' => now()->subDays(2)]);
    }
}
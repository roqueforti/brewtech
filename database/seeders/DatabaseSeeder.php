<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Kelas;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. INSTRUKTUR
        User::create([
            'name' => 'Hilman Instructor',
            'email' => 'admin@brewtech.com',
            'password' => Hash::make('password'),
            'role' => 'instructor',
        ]);

        // 2. KELAS DUMMY (Perhatikan 'theme' adalah string)
        $kelasA = Kelas::create([
            'nama' => 'Manual Brew Basic',
            'emoji' => '☕',
            'pelatih' => 'Hilman',
            'periode' => 'Jan - Mar 2024',
            'deskripsi' => 'Kelas dasar teknik seduh manual V60.',
            'theme' => 'green', // ✅ String
            'status' => 'Aktif'
        ]);

        $kelasB = Kelas::create([
            'nama' => 'Espresso Master',
            'emoji' => '🚀',
            'pelatih' => 'Budi',
            'periode' => 'Feb - Apr 2024',
            'deskripsi' => 'Teknik kalibrasi espresso lanjutan.',
            'theme' => 'yellow', // ✅ String
            'status' => 'Aktif'
        ]);

        // 3. SISWA
        User::create([
            'name' => 'Siswa Satu',
            'email' => 'siswa1@brewtech.com',
            'password' => Hash::make('password'),
            'role' => 'student',
            'kelas_id' => $kelasA->id,
            'pre_test_score' => 40,
            'post_test_score' => 85,
            'status_pkl' => 'siap'
        ]);
    }
}
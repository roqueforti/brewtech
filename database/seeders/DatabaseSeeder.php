<?php

namespace Database\Seeders;

use App\Models\Kelas;
use App\Models\User;
use App\Models\StudentSpkResult; 
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // ==========================================
        // 1. BUAT AKUN PENGAJAR (ADMIN)
        // ==========================================
        User::create([
            'name' => 'Admin BrewTech',
            'email' => 'admin@brewtech.com',
            'password' => Hash::make('admin123'),
            'role' => 'instructor',
            'kelas_id' => null,
        ]);

        // ==========================================
        // 2. DATA KELAS (DENGAN TEMA WARNA KARTUN)
        // ==========================================
        $daftarKelas = [
            [
                'nama' => 'Morning Batch',
                'emoji' => '🌅',
                'pelatih' => 'Ms. Sari',
                'theme' => [
                    'bg' => 'bg-orange-100',
                    'border' => 'border-orange-400',
                    'text' => 'text-orange-800',
                    'shadow' => 'shadow-orange-200'
                ]
            ],
            [
                'nama' => 'Afternoon Batch',
                'emoji' => '☀️',
                'pelatih' => 'Mr. Budi',
                'theme' => [
                    'bg' => 'bg-yellow-100',
                    'border' => 'border-yellow-400',
                    'text' => 'text-yellow-800',
                    'shadow' => 'shadow-yellow-200'
                ]
            ],
            [
                'nama' => 'Evening Batch',
                'emoji' => '🌆',
                'pelatih' => 'Ms. Dewi',
                'theme' => [
                    'bg' => 'bg-blue-100',
                    'border' => 'border-blue-400',
                    'text' => 'text-blue-800',
                    'shadow' => 'shadow-blue-200'
                ]
            ],
        ];

        // ==========================================
        // 3. DAFTAR NAMA SISWA
        // ==========================================
        $studentNames = [
            ['Alex', 'Bella', 'Charlie', 'Diana', 'Eko', 'Fajar', 'Gita', 'Hana'],
            ['Indra', 'Joko', 'Kiki', 'Lina', 'Maya', 'Naufal', 'Olivia', 'Putra'],
            ['Qila', 'Rara', 'Sandi', 'Tio', 'Umar', 'Vina', 'Wawan', 'Yara']
        ];

        // ==========================================
        // 4. EKSEKUSI LOOPING
        // ==========================================
        foreach ($daftarKelas as $index => $dataKelas) {
            // A. Simpan Kelas
            $kelasBaru = Kelas::create($dataKelas);

            // B. Ambil daftar nama untuk kelas ini
            $namesForThisClass = $studentNames[$index] ?? [];

            // C. Buat User (Siswa)
            foreach ($namesForThisClass as $namaSiswa) {
                
                // 1. Buat User Siswa
                $student = User::create([
                    'name' => $namaSiswa,
                    'email' => strtolower($namaSiswa) . '.' . strtolower(str_replace(' ', '', $kelasBaru->nama)) . '@student.com',
                    'password' => Hash::make('password'),
                    'role' => 'student',
                    'kelas_id' => $kelasBaru->id,
                ]);

                // 2. DATA SPK DUMMY DIMATIKAN
                // Agar siswa benar-benar mulai dari nol saat login pertama kali.
                // Jika ingin testing data penuh, uncomment bagian ini.
                /*
                StudentSpkResult::create([
                    'user_id' => $student->id,
                    'avg_pretest' => rand(50, 75),
                    'avg_posttest' => rand(80, 100),
                    'avg_activity' => rand(85, 95),
                    'predikat_kompetensi' => 'KOMPETEN',
                    'predikat_pengetahuan' => 'Baik',
                    'predikat_keterampilan' => 'Sangat Baik',
                    'predikat_sikap' => 'Baik',
                    'kelebihan' => ['Sangat teliti dalam instruksi', 'Cepat memahami konsep baru', 'Sikap kerja yang baik'],
                    'area_pengembangan' => ['Perlu meningkatkan kecepatan', 'Latihan lebih banyak di bagian Espresso'],
                    'nilai_keseluruhan' => rand(85, 98),
                    'rekomendasi_selanjutnya' => 'Berdasarkan hasil analisis, siswa direkomendasikan untuk melanjutkan ke modul Kewirausahaan.'
                ]);
                */
            }
        }

        // ==========================================
        // 5. PANGGIL SEEDER WORKSHOP V60
        // ==========================================
        // Pastikan V60Seeder.php sudah ada di folder database/seeders
        $this->call(V60Seeder::class);
    }
}
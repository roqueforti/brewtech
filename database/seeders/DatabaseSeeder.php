<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Kelas;
use App\Models\Module;
use App\Models\ModuleStep;
use App\Models\ModuleQuestion;
use App\Models\StudentModuleProgress;
use App\Models\Setting;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // ==========================================
        // 1. INSTRUKTUR
        // ==========================================
        User::create(['name' => 'Hilman Instructor', 'email' => 'admin@brewtech.com', 'password' => Hash::make('password'), 'role' => 'instructor']);
        User::create(['name' => 'Bu Ani Pembimbing', 'email' => 'ani@ypac.com', 'password' => Hash::make('password'), 'role' => 'instructor']);

        // ==========================================
        // 2. KELAS SPESIFIK
        // ==========================================
        $kelasYpac = Kelas::create([
            'nama' => 'SLB YPAC Kota Malang',
            'emoji' => '🏫',
            'pelatih' => 'Kak Hilman & Bu Ani',
            'periode' => 'Jan - Jun 2026',
            'deskripsi' => 'Program pelatihan vokasional barista inklusi untuk siswa SLB YPAC Kota Malang.',
            'theme' => 'blue', 
            'status' => 'Aktif'
        ]);

        // ==========================================
        // 3. 10 SISWA
        // ==========================================
        $studentsData = [
            ['name' => 'Aditya Pratama', 'disability' => 'Tuna Rungu', 'email' => 'aditya@ypac.com'],
            ['name' => 'Bunga Citra', 'disability' => 'Tuna Daksa', 'email' => 'bunga@ypac.com'],
            ['name' => 'Candra Wijaya', 'disability' => 'Autisme Ringan', 'email' => 'candra@ypac.com'],
            ['name' => 'Dinda Kirana', 'disability' => 'Slow Learner', 'email' => 'dinda@ypac.com'],
            ['name' => 'Eko Prasetyo', 'disability' => 'Tuna Grahita', 'email' => 'eko@ypac.com'],
            ['name' => 'Fajar Nugraha', 'disability' => 'Tuna Rungu', 'email' => 'fajar@ypac.com'],
            ['name' => 'Gita Savitri', 'disability' => 'Tuna Daksa', 'email' => 'gita@ypac.com'],
            ['name' => 'Hadi Santoso', 'disability' => 'Autisme', 'email' => 'hadi@ypac.com'],
            ['name' => 'Indah Permata', 'disability' => 'Slow Learner', 'email' => 'indah@ypac.com'],
            ['name' => 'Joko Susilo', 'disability' => 'Tuna Grahita', 'email' => 'joko@ypac.com'],
        ];

        foreach ($studentsData as $index => $data) {
            User::create([
                'name' => $data['name'],
                'email' => $data['email'], 
                'password' => Hash::make('password'), 
                'role' => 'student',
                'phone' => '0812345678' . $index,
                'age' => 17 + $index, 
                'school_grade' => 'SMALB',
                'disability' => $data['disability'],
                'kelas_id' => $kelasYpac->id,
                'status_pkl' => 'siap'
            ]);
        }

        // ==========================================
        // 4. MASTER 10 MODUL (FULL MEDIA)
        // ==========================================
        
        $modulesData = [
            [
                'title' => '1. Pengenalan Kopi',
                'desc' => 'Mengenal perbedaan dasar biji kopi Arabica dan Robusta serta aroma dasarnya.',
                'criteria' => ['Ketelitian Membedakan', 'Fokus Visual', 'Penciuman Aroma'],
                'steps' => [
                    ['title' => 'Lihat Biji Arabica', 'desc' => 'Biji Arabica bentuknya lonjong.', 'media' => 'https://placehold.co/600x400/4a3b32/white?text=Biji+Arabica'],
                    ['title' => 'Lihat Biji Robusta', 'desc' => 'Biji Robusta bentuknya bulat.', 'media' => 'https://placehold.co/600x400/2e231e/white?text=Biji+Robusta'],
                ],
                'pre' => [[
                    'q' => 'Apa warna biji kopi mentah sebelum disangrai?', 
                    'media' => 'https://placehold.co/600x400/green/white?text=Biji+Mentah',
                    'opt' => ['Hijau', 'Merah', 'Hitam', 'Biru'], 
                    'opt_media' => [
                        'https://placehold.co/200x200/green/white?text=Hijau', 
                        'https://placehold.co/200x200/red/white?text=Merah', 
                        'https://placehold.co/200x200/black/white?text=Hitam', 
                        'https://placehold.co/200x200/blue/white?text=Biru'
                    ],
                    'ans' => '0'
                ]],
                'post' => [[
                    'q' => 'Manakah gambar biji kopi Robusta (Bulat)?', 
                    'media' => 'https://placehold.co/600x400/333/white?text=Tebak+Biji',
                    'opt' => ['Lonjong (Arabica)', 'Bulat (Robusta)', 'Sangat Besar', 'Pecah'], 
                    'opt_media' => [
                        'https://placehold.co/200x200/555/white?text=Lonjong', 
                        'https://placehold.co/200x200/555/white?text=Bulat+Robusta', 
                        'https://placehold.co/200x200/555/white?text=Raksasa', 
                        'https://placehold.co/200x200/555/white?text=Pecah'
                    ],
                    'ans' => '1'
                ]]
            ],
            [
                'title' => '2. Teknik Grinding (Giling)',
                'desc' => 'Mengoperasikan grinder dan mengenal tingkat kehalusan kopi.',
                'criteria' => ['Keamanan Alat', 'Ketepatan Ukuran', 'Kebersihan Area'],
                'steps' => [
                    ['title' => 'Hidupkan Grinder', 'desc' => 'Tekan tombol ON.', 'media' => 'https://placehold.co/600x400/333/white?text=Mesin+Grinder'],
                    ['title' => 'Cek Hasil', 'desc' => 'Pastikan halus.', 'media' => 'https://placehold.co/600x400/555/white?text=Bubuk+Kopi'],
                ],
                'pre' => [[
                    'q' => 'Manakah alat Grinder (Penggiling)?', 
                    'media' => null,
                    'opt' => ['Blender Jus', 'Mixer Kue', 'Grinder Kopi', 'Oven'], 
                    'opt_media' => [
                        'https://placehold.co/200x200/orange/white?text=Blender', 
                        'https://placehold.co/200x200/pink/white?text=Mixer', 
                        'https://placehold.co/200x200/black/white?text=Grinder+Kopi', 
                        'https://placehold.co/200x200/gray/white?text=Oven'
                    ],
                    'ans' => '2'
                ]],
                'post' => [[
                    'q' => 'Gilingan Halus (Fine) seperti apa?', 
                    'media' => 'https://placehold.co/600x400/brown/white?text=Tekstur+Kopi',
                    'opt' => ['Kasar (Garam Kasar)', 'Halus (Tepung/Espresso)', 'Biji Utuh', 'Cair'], 
                    'opt_media' => [
                        'https://placehold.co/200x200/brown/white?text=Kasar', 
                        'https://placehold.co/200x200/brown/white?text=Halus+Fine', 
                        'https://placehold.co/200x200/brown/white?text=Biji', 
                        'https://placehold.co/200x200/brown/white?text=Air'
                    ],
                    'ans' => '1'
                ]]
            ],
            [
                'title' => '3. Teknik Tamping Espresso',
                'desc' => 'Memadatkan bubuk kopi di portafilter.',
                'criteria' => ['Kekuatan Tamping', 'Kerapian', 'Posisi Siku'],
                'steps' => [
                    ['title' => 'Ratakan', 'desc' => 'Ratakan bubuk.', 'media' => 'https://placehold.co/600x400/444/white?text=Portafilter'],
                    ['title' => 'Tekan', 'desc' => 'Tekan dengan tamper.', 'media' => 'https://placehold.co/600x400/222/white?text=Tamping'],
                ],
                'pre' => [[
                    'q' => 'Mana alat Tamper?', 
                    'media' => null,
                    'opt' => ['Palu', 'Tamper Kopi', 'Sendok', 'Obeng'], 
                    'opt_media' => [
                        'https://placehold.co/200x200/gray/white?text=Palu', 
                        'https://placehold.co/200x200/black/white?text=Tamper', 
                        'https://placehold.co/200x200/gray/white?text=Sendok', 
                        'https://placehold.co/200x200/gray/white?text=Obeng'
                    ],
                    'ans' => '1'
                ]],
                'post' => [[
                    'q' => 'Hasil tamping yang benar adalah?', 
                    'media' => 'https://placehold.co/600x400/333/white?text=Proses+Tamping',
                    'opt' => ['Miring', 'Padat & Rata', 'Berlubang', 'Tumpah'], 
                    'opt_media' => [
                        'https://placehold.co/200x200/red/white?text=Miring', 
                        'https://placehold.co/200x200/green/white?text=Rata+Padat', 
                        'https://placehold.co/200x200/red/white?text=Lubang', 
                        'https://placehold.co/200x200/red/white?text=Tumpah'
                    ],
                    'ans' => '1'
                ]]
            ],
            [
                'title' => '4. Ekstraksi Espresso',
                'desc' => 'Menggunakan mesin espresso.',
                'criteria' => ['Waktu Ekstraksi', 'Warna Crema', 'Kebersihan'],
                'steps' => [
                    ['title' => 'Pasang', 'desc' => 'Pasang alat ke mesin.', 'media' => 'https://placehold.co/600x400/111/white?text=Pasang+Alat'],
                    ['title' => 'Seduh', 'desc' => 'Tekan tombol.', 'media' => 'https://placehold.co/600x400/000/white?text=Flow+Kopi'],
                ],
                'pre' => [[
                    'q' => 'Berapa lama waktu seduh espresso ideal?', 
                    'media' => 'https://placehold.co/600x400/333/white?text=Stopwatch',
                    'opt' => ['5 Detik (Cepat)', '25-30 Detik (Ideal)', '1 Menit (Lama)', '1 Jam'], 
                    'opt_media' => [
                        'https://placehold.co/200x200/red/white?text=5s', 
                        'https://placehold.co/200x200/green/white?text=30s', 
                        'https://placehold.co/200x200/red/white?text=60s', 
                        'https://placehold.co/200x200/red/white?text=1h'
                    ],
                    'ans' => '1'
                ]],
                'post' => [[
                    'q' => 'Lapisan busa emas di atas kopi disebut?', 
                    'media' => 'https://placehold.co/600x400/brown/white?text=Espresso+Shot',
                    'opt' => ['Busa Sabun', 'Crema', 'Susu', 'Minyak'], 
                    'opt_media' => [
                        'https://placehold.co/200x200/white/black?text=Sabun', 
                        'https://placehold.co/200x200/orange/white?text=Crema+Emas', 
                        'https://placehold.co/200x200/white/black?text=Susu', 
                        'https://placehold.co/200x200/yellow/black?text=Minyak'
                    ],
                    'ans' => '1'
                ]]
            ],
            [
                'title' => '5. Steam Susu',
                'desc' => 'Memanaskan susu (Microfoam).',
                'criteria' => ['Suhu Susu', 'Tekstur Foam', 'Suara'],
                'steps' => [
                    ['title' => 'Steam', 'desc' => 'Masukkan uap panas.', 'media' => 'https://placehold.co/600x400/eee/333?text=Steam+Susu'],
                    ['title' => 'Suhu', 'desc' => 'Jangan terlalu panas.', 'media' => 'https://placehold.co/600x400/ddd/333?text=Cek+Suhu'],
                ],
                'pre' => [[
                    'q' => 'Susu apa yang dipakai untuk latte?', 
                    'media' => 'https://placehold.co/600x400/white/black?text=Jenis+Susu',
                    'opt' => ['Kental Manis', 'Fresh Milk (UHT)', 'Santan', 'Air Tajin'], 
                    'opt_media' => [
                        'https://placehold.co/200x200/white/black?text=SKM', 
                        'https://placehold.co/200x200/white/black?text=Fresh+Milk', 
                        'https://placehold.co/200x200/white/black?text=Santan', 
                        'https://placehold.co/200x200/white/black?text=Tajin'
                    ],
                    'ans' => '1'
                ]],
                'post' => [[
                    'q' => 'Jika suara steam "menjerit" keras, artinya?', 
                    'media' => 'https://placehold.co/600x400/333/white?text=Mesin+Berisik',
                    'opt' => ['Bagus', 'Mesin Rusak', 'Posisi Salah (Terlalu Dalam)', 'Susu Habis'], 
                    'opt_media' => [
                        'https://placehold.co/200x200/green/white?text=Ok', 
                        'https://placehold.co/200x200/red/white?text=Rusak', 
                        'https://placehold.co/200x200/orange/white?text=Salah+Posisi', 
                        'https://placehold.co/200x200/gray/white?text=Habis'
                    ],
                    'ans' => '2'
                ]]
            ],
            [
                'title' => '6. Membuat Cappuccino',
                'desc' => 'Espresso + Susu Foam Tebal.',
                'criteria' => ['Ketebalan Foam', 'Rasio', 'Tampilan'],
                'steps' => [
                    ['title' => 'Espresso', 'desc' => 'Siapkan kopi.', 'media' => 'https://placehold.co/600x400/6f4e37/white?text=Espresso'],
                    ['title' => 'Tuang Susu', 'desc' => 'Tuang dengan foam tebal.', 'media' => 'https://placehold.co/600x400/d2b48c/white?text=Cappuccino'],
                ],
                'pre' => [[
                    'q' => 'Ciri khas Cappuccino adalah?', 
                    'media' => 'https://placehold.co/600x400/d2b48c/white?text=Minuman+Kopi',
                    'opt' => ['Banyak Air', 'Foam Susu Tebal', 'Warna Hitam', 'Dingin'], 
                    'opt_media' => [
                        'https://placehold.co/200x200/blue/white?text=Air', 
                        'https://placehold.co/200x200/d2b48c/white?text=Foam+Tebal', 
                        'https://placehold.co/200x200/black/white?text=Hitam', 
                        'https://placehold.co/200x200/blue/white?text=Es'
                    ],
                    'ans' => '1'
                ]],
                'post' => [[
                    'q' => 'Rasa dominan Cappuccino?', 
                    'media' => null,
                    'opt' => ['Rasa Susu', 'Rasa Kopi Kuat', 'Rasa Cokelat', 'Rasa Jeruk'], 
                    'opt_media' => [
                        'https://placehold.co/200x200/white/black?text=Susu', 
                        'https://placehold.co/200x200/brown/white?text=Kopi', 
                        'https://placehold.co/200x200/brown/white?text=Cokelat', 
                        'https://placehold.co/200x200/orange/white?text=Jeruk'
                    ],
                    'ans' => '1'
                ]]
            ],
            [
                'title' => '7. Membuat Cafe Latte',
                'desc' => 'Kopi Susu Milky (Foam Tipis).',
                'criteria' => ['Tekstur Silky', 'Rasa Milky', 'Suhu'],
                'steps' => [
                    ['title' => 'Steam Halus', 'desc' => 'Buat foam tipis.', 'media' => 'https://placehold.co/600x400/f5f5dc/333?text=Microfoam'],
                    ['title' => 'Tuang', 'desc' => 'Tuang susu cair.', 'media' => 'https://placehold.co/600x400/fff8dc/333?text=Latte'],
                ],
                'pre' => [[
                    'q' => 'Latte berasal dari bahasa Italia artinya?', 
                    'media' => 'https://placehold.co/600x400/333/white?text=Latte=?',
                    'opt' => ['Kopi', 'Susu', 'Gula', 'Sirup'], 
                    'opt_media' => [
                        'https://placehold.co/200x200/black/white?text=Kopi', 
                        'https://placehold.co/200x200/white/black?text=Susu', 
                        'https://placehold.co/200x200/gray/white?text=Gula', 
                        'https://placehold.co/200x200/red/white?text=Sirup'
                    ],
                    'ans' => '1'
                ]],
                'post' => [[
                    'q' => 'Mana yang lebih banyak susunya?', 
                    'media' => 'https://placehold.co/600x400/333/white?text=Bandingkan',
                    'opt' => ['Cappuccino', 'Cafe Latte (Lebih Milky)', 'Espresso', 'Americano'], 
                    'opt_media' => [
                        'https://placehold.co/200x200/brown/white?text=Cappuccino', 
                        'https://placehold.co/200x200/white/black?text=Latte', 
                        'https://placehold.co/200x200/black/white?text=Espresso', 
                        'https://placehold.co/200x200/black/white?text=Americano'
                    ],
                    'ans' => '1'
                ]]
            ],
            [
                'title' => '8. Teknik Seduh V60',
                'desc' => 'Seduh Manual Pour Over.',
                'criteria' => ['Gerakan Memutar', 'Waktu', 'Air'],
                'steps' => [
                    ['title' => 'Basahi', 'desc' => 'Bilas kertas.', 'media' => 'https://placehold.co/600x400/orange/white?text=Bilas+Kertas'],
                    ['title' => 'Tuang', 'desc' => 'Tuang memutar.', 'media' => 'https://placehold.co/600x400/orange/white?text=Pouring'],
                ],
                'pre' => [[
                    'q' => 'Mana alat V60?', 
                    'media' => null,
                    'opt' => ['V60 Dripper', 'French Press', 'Tubruk', 'Syphon'], 
                    'opt_media' => [
                        'https://placehold.co/200x200/transparent/black?text=V60', 
                        'https://placehold.co/200x200/transparent/black?text=Press', 
                        'https://placehold.co/200x200/transparent/black?text=Gelas', 
                        'https://placehold.co/200x200/transparent/black?text=Syphon'
                    ],
                    'ans' => '0'
                ]],
                'post' => [[
                    'q' => 'Kenapa menuang air harus memutar?', 
                    'media' => 'https://placehold.co/600x400/333/white?text=Gerakan+Memutar',
                    'opt' => ['Biar Pusing', 'Agar Kopi Terekstraksi Rata', 'Agar Cepat Dingin', 'Agar Tumpah'], 
                    'opt_media' => [
                        'https://placehold.co/200x200/gray/white?text=Pusing', 
                        'https://placehold.co/200x200/green/white?text=Rata', 
                        'https://placehold.co/200x200/blue/white?text=Dingin', 
                        'https://placehold.co/200x200/red/white?text=Tumpah'
                    ],
                    'ans' => '1'
                ]]
            ],
            [
                'title' => '9. Es Kopi Susu Aren',
                'desc' => 'Menu kopi kekinian.',
                'criteria' => ['Takaran', 'Layering', 'Kecepatan'],
                'steps' => [
                    ['title' => 'Gula', 'desc' => 'Tuang aren.', 'media' => 'https://placehold.co/600x400/8b4513/white?text=Gula+Aren'],
                    ['title' => 'Susu & Kopi', 'desc' => 'Tuang susu lalu espresso.', 'media' => 'https://placehold.co/600x400/654321/white?text=Kopsus+Jadi'],
                ],
                'pre' => [[
                    'q' => 'Mana gambar Gula Aren?', 
                    'media' => null,
                    'opt' => ['Gula Pasir (Putih)', 'Gula Aren (Cokelat)', 'Gula Batu', 'Gula Halus'], 
                    'opt_media' => [
                        'https://placehold.co/200x200/white/black?text=Putih', 
                        'https://placehold.co/200x200/brown/white?text=Aren', 
                        'https://placehold.co/200x200/gray/white?text=Batu', 
                        'https://placehold.co/200x200/white/black?text=Halus'
                    ],
                    'ans' => '1'
                ]],
                'post' => [[
                    'q' => 'Urutan layer yang benar?', 
                    'media' => 'https://placehold.co/600x400/brown/white?text=Minuman+Layer',
                    'opt' => ['Kopi-Susu-Gula', 'Gula-Es-Susu-Kopi', 'Susu-Kopi-Gula', 'Es-Kopi-Gula'], 
                    'opt_media' => [
                        'https://placehold.co/200x200/gray/white?text=Salah', 
                        'https://placehold.co/200x200/green/white?text=Benar', 
                        'https://placehold.co/200x200/gray/white?text=Salah', 
                        'https://placehold.co/200x200/gray/white?text=Salah'
                    ],
                    'ans' => '1'
                ]]
            ],
            [
                'title' => '10. Kebersihan (Cleaning)',
                'desc' => 'Membersihkan alat kopi.',
                'criteria' => ['Kebersihan', 'Kerapian', 'Keamanan'],
                'steps' => [
                    ['title' => 'Cuci', 'desc' => 'Cuci alat.', 'media' => 'https://placehold.co/600x400/00bcd4/white?text=Cuci+Alat'],
                    ['title' => 'Lap', 'desc' => 'Lap mesin.', 'media' => 'https://placehold.co/600x400/009688/white?text=Lap+Mesin'],
                ],
                'pre' => [[
                    'q' => 'Kapan Steam Wand harus dibersihkan?', 
                    'media' => 'https://placehold.co/600x400/555/white?text=Steam+Wand+Kotor',
                    'opt' => ['Besok Pagi', 'Minggu Depan', 'Segera Setelah Dipakai', 'Tidak Perlu'], 
                    'opt_media' => [
                        'https://placehold.co/200x200/gray/white?text=Besok', 
                        'https://placehold.co/200x200/gray/white?text=Minggu', 
                        'https://placehold.co/200x200/green/white?text=Segera', 
                        'https://placehold.co/200x200/red/white?text=X'
                    ],
                    'ans' => '2'
                ]],
                'post' => [[
                    'q' => 'Lap meja dan lap mesin boleh dicampur?', 
                    'media' => 'https://placehold.co/600x400/333/white?text=Kain+Lap',
                    'opt' => ['Boleh', 'Tidak Boleh (Harus Pisah)', 'Terserah', 'Boleh asal kering'], 
                    'opt_media' => [
                        'https://placehold.co/200x200/green/white?text=Boleh', 
                        'https://placehold.co/200x200/red/white?text=Pisah', 
                        'https://placehold.co/200x200/gray/white?text=Terserah', 
                        'https://placehold.co/200x200/gray/white?text=Kering'
                    ],
                    'ans' => '1'
                ]]
            ],
        ];

        // LOOP CREATE MODULES & ASSIGN WITH STATUS
        $moduleIds = [];
        foreach ($modulesData as $mData) {
            $mod = $this->createModule(
                $mData['title'],
                $mData['desc'],
                $mData['criteria'],
                $mData['steps'],
                $mData['pre'],
                $mData['post']
            );
            
            // ✅ SET is_active=true AGAR LANGSUNG BISA DIAKSES SISWA
            $moduleIds[$mod->id] = [
                'is_active' => true,
                'opens_at' => now(), // Terbuka sekarang juga
            ];
        }

        // Assign SEMUA Modul ke Kelas YPAC
        $kelasYpac->modules()->attach($moduleIds);

        // ==========================================
        // 5. SETTINGS APLIKASI
        // ==========================================
        if (Setting::count() == 0) {
            Setting::create(['key' => 'spk_bobot_visual', 'value' => '60', 'type' => 'number']);
            Setting::create(['key' => 'spk_bobot_soft', 'value' => '40', 'type' => 'number']);
            Setting::create(['key' => 'spk_threshold_siap', 'value' => '85', 'type' => 'number']);
            Setting::create(['key' => 'spk_threshold_pantau', 'value' => '75', 'type' => 'number']);
        }
    }

    // --- HELPERS ---
    private function createModule($title, $desc, $criteria, $steps, $preTest, $postTest) {
        $mod = Module::create([
            'title' => $title, 
            'description' => $desc,
            'soft_skill_config' => $criteria,
            'emoji' => '☕'
        ]);
        
        foreach ($steps as $s) {
            ModuleStep::create([
                'module_id' => $mod->id, 
                'title' => $s['title'], 
                'description' => $s['desc'], 
                'media_type' => 'image',
                'media_url' => $s['media'] ?? null
            ]);
        }
        
        $this->storeQuestions($mod->id, 'pre_test', $preTest);
        $this->storeQuestions($mod->id, 'post_test', $postTest);
        
        return $mod;
    }

    private function storeQuestions($moduleId, $type, $questions) {
        foreach ($questions as $q) {
            
            // Format options media
            $optionMedias = [];
            if (isset($q['opt_media']) && is_array($q['opt_media'])) {
                foreach ($q['opt_media'] as $url) {
                    $optionMedias[] = $url ? ['url' => $url, 'type' => 'image'] : null;
                }
            } else {
                $optionMedias = [null, null, null, null];
            }

            ModuleQuestion::create([
                'module_id' => $moduleId, 
                'type' => $type, 
                'question' => $q['q'], 
                'options' => $q['opt'], 
                'correct_answer' => $q['ans'], 
                'media_url' => $q['media'] ?? null, 
                'media_type' => isset($q['media']) ? 'image' : null,
                'options_media' => $optionMedias
            ]);
        }
    }
}
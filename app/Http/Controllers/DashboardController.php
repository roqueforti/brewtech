<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Workshop; // Pastikan Import Model Workshop
use App\Models\StudentSpkResult;
use App\Models\StudentWorkshopProgress; // Import Progress
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    // ==========================================
    // DASHBOARD PESERTA (SISWA)
    // ==========================================
    public function indexPeserta()
    {
        $user = Auth::user();

        // 1. Ambil Semua Workshop dari Database
        $allWorkshops = Workshop::all();

        // 2. Format Data agar sesuai dengan tampilan React
        $formattedWorkshops = $allWorkshops->map(function ($ws) use ($user) {
            
            // Cek apakah siswa sudah punya progress di workshop ini?
            $progress = StudentWorkshopProgress::where('user_id', $user->id)
                        ->where('workshop_id', $ws->id)
                        ->first();

            // Tentukan Status (Locked / Available / Completed)
            $status = 'locked'; // Default terkunci

            // ATURAN LOGIKA:
            // Jika ini Workshop Pertama (V60), dan belum ada progress -> BUKA (Available)
            if ($ws->id === 1 && !$progress) {
                $status = 'available';
            }
            // Jika sudah ada record progress
            elseif ($progress) {
                if ($progress->status === 'completed') {
                    $status = 'completed';
                } else {
                    $status = 'available'; // in_progress atau available dianggap bisa dimainkan
                }
            }
            
            return [
                'id' => $ws->id,
                'title' => $ws->title,
                'subtitle' => $ws->subtitle,
                'emoji' => $ws->emoji,
                'status' => $status, // Ini yang menentukan tombol Mulai/Kunci
                'theme' => $ws->theme, // Warna-warni dari database
            ];
        });

        // 3. Hitung Statistik untuk Header Dashboard
        $stats = [
            'completed' => $formattedWorkshops->where('status', 'completed')->count(),
            'active'    => $formattedWorkshops->where('status', 'available')->count(),
            'locked'    => $formattedWorkshops->where('status', 'locked')->count(),
        ];

        return Inertia::render('Peserta/Dashboard', [
            'auth' => [
                'user' => $user->load('kelas'), // Load data kelas (Morning/Afternoon)
            ],
            'workshops' => $formattedWorkshops, // Kirim data V60 ke sini
            'stats' => $stats
        ]);
    }

    // ==========================================
    // HALAMAN LAINNYA
    // ==========================================
    
    // Halaman Workshop Player (Redirect ke Controller Workshop khusus)
    public function workshopFlow()
    {
        return redirect()->route('workshop.play', ['id' => 1]);
    }

    // Halaman Rapor / Nilai SPK
    public function nilaiSpk()
    {
        $user = Auth::user();
        $spk = StudentSpkResult::where('user_id', $user->id)->first();

        // Persona Logic (Sama seperti sebelumnya)
        $persona = 'The Balanced Barista';
        $badge = '⚖️';
        
        if($spk) {
            if ($spk->predikat_keterampilan == 'Sangat Baik' && $spk->predikat_pengetahuan != 'Sangat Baik') {
                $persona = 'The Artisan Crafter'; $badge = '🎨';
            } elseif ($spk->predikat_pengetahuan == 'Sangat Baik' && $spk->predikat_keterampilan != 'Sangat Baik') {
                $persona = 'The Coffee Scholar'; $badge = '📚';
            } elseif ($spk->predikat_sikap == 'Sangat Baik') {
                $persona = 'The Service Star'; $badge = '✨';
            }
        }

        // Data Mockup Riwayat Workshop (Nanti bisa diganti DB juga)
        $workshopRecap = [
            [
                'id' => 1,
                'title' => 'V60 Manual Brew',
                'date' => 'Hari Ini',
                'score' => $spk ? $spk->nilai_keseluruhan : 0,
                'status' => $spk ? 'Selesai' : 'Belum',
                'insight' => 'Teknik dasar penyeduhan manual.',
                'color' => 'bg-orange-100 border-orange-300 text-orange-800'
            ]
        ];

        return Inertia::render('Peserta/NilaiSPK', [
            'auth' => ['user' => $user],
            'spk' => $spk,
            'extra' => [
                'persona' => $persona,
                'badge' => $badge,
                'workshops' => $workshopRecap
            ]
        ]);
    }

    public function profil()
    {
        $user = Auth::user();

        // 1. Ambil Data Progress Workshop (Real dari DB)
        $workshopProgress = StudentWorkshopProgress::where('user_id', $user->id)
                            ->with('workshop') // Eager load workshop detail
                            ->get();

        // 2. Hitung Statistik
        $completedCount = $workshopProgress->where('status', 'completed')->count();
        $totalWorkshops = Workshop::count();
        
        // Logika Level & XP Sederhana
        // Setiap workshop selesai = 500 XP
        // Setiap pretest/posttest = skornya jadi XP
        $xp = 0;
        foreach($workshopProgress as $prog) {
            if($prog->status == 'completed') $xp += 500;
            $xp += ($prog->pretest_score ?? 0);
            $xp += ($prog->posttest_score ?? 0);
        }
        
        // Level naik setiap 1000 XP
        $level = 1 + floor($xp / 1000);

        // 3. Format Data untuk Frontend
        $formattedProgress = Workshop::all()->map(function($ws) use ($workshopProgress) {
            $myProg = $workshopProgress->where('workshop_id', $ws->id)->first();
            
            $status = 'Terkunci';
            $percent = 0;

            if ($ws->id == 1 && !$myProg) {
                $status = 'Sedang Belajar'; // Workshop pertama otomatis terbuka
            } elseif ($myProg) {
                if ($myProg->status == 'completed') {
                    $status = 'Selesai';
                    $percent = 100;
                } else {
                    $status = 'Sedang Belajar';
                    // Hitung % kasar: Pretest=30%, Praktikum=60%, Posttest=90%, Foto=100%
                    if ($myProg->pretest_score !== null) $percent = 30;
                    if ($myProg->praktikum_completed) $percent = 60;
                    if ($myProg->posttest_score !== null) $percent = 90;
                }
            }

            return [
                'title' => $ws->title,
                'progress_percent' => $percent,
                'status' => $status
            ];
        });

        // 4. Data Achievements (Logika Sederhana)
        $achievements = [
            [
                'id' => 1, 
                'title' => 'Pemula', 
                'emoji' => '🌱', 
                'unlocked' => true // Semua user dapat ini
            ],
            [
                'id' => 2, 
                'title' => 'Rajin', 
                'emoji' => '📚', 
                'unlocked' => $workshopProgress->count() > 0 // Dapat jika sudah mulai workshop
            ],
            [
                'id' => 3, 
                'title' => 'Barista', 
                'emoji' => '☕', 
                'unlocked' => $completedCount >= 1 // Dapat jika selesai 1 workshop
            ],
            [
                'id' => 4, 
                'title' => 'Master', 
                'emoji' => '👨‍🍳', 
                'unlocked' => $completedCount >= 3
            ],
            [
                'id' => 5, 
                'title' => 'Sempurna', 
                'emoji' => '💯', 
                'unlocked' => $workshopProgress->where('posttest_score', 100)->count() > 0
            ],
            [
                'id' => 6, 
                'title' => 'Bintang', 
                'emoji' => '⭐', 
                'unlocked' => $level >= 5
            ],
        ];

        return Inertia::render('Peserta/ProfilPeserta', [
            'auth' => ['user' => $user],
            'stats' => [
                'level' => $level,
                'xp' => $xp,
                'streak' => 1, // Logic streak butuh tabel log harian, sementara hardcode 1
                'completed_workshops' => $completedCount,
                'total_workshops' => $totalWorkshops
            ],
            'achievements' => $achievements,
            'progress_list' => $formattedProgress
        ]);
    }

}
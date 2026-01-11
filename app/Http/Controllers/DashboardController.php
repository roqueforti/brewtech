<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Workshop;
use App\Models\StudentSpkResult;
use App\Models\StudentWorkshopProgress;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    // ==========================================
    // 1. DASHBOARD PESERTA (SISWA)
    // ==========================================
    public function indexPeserta()
    {
        $user = Auth::user();

        // Ambil Semua Workshop & Progress
        $allWorkshops = Workshop::all();
        
        $formattedWorkshops = $allWorkshops->map(function ($ws) use ($user) {
            $progress = StudentWorkshopProgress::where('user_id', $user->id)
                        ->where('workshop_id', $ws->id)
                        ->first();

            $status = 'locked'; 

            // Logika Buka Kunci
            if ($ws->id === 1 && !$progress) {
                $status = 'available';
            } elseif ($progress) {
                if ($progress->status === 'completed') {
                    $status = 'completed';
                } else {
                    $status = 'available';
                }
            }
            
            return [
                'id' => $ws->id,
                'title' => $ws->title,
                'subtitle' => $ws->subtitle,
                'emoji' => $ws->emoji,
                'status' => $status,
                'theme' => $ws->theme,
            ];
        });

        // Statistik
        $stats = [
            'completed' => $formattedWorkshops->where('status', 'completed')->count(),
            'active'    => $formattedWorkshops->where('status', 'available')->count(),
            'locked'    => $formattedWorkshops->where('status', 'locked')->count(),
        ];

        return Inertia::render('Peserta/Dashboard', [
            'auth' => ['user' => $user->load('kelas')],
            'workshops' => $formattedWorkshops,
            'stats' => $stats
        ]);
    }

    // ==========================================
    // 2. DASHBOARD PENGAJAR (GURU)
    // ==========================================
    public function indexPengajar()
    {
        $user = Auth::user();

        // Pastikan hanya instruktur yang akses (Optional security layer)
        if ($user->role !== 'instructor' && $user->role !== 'admin') {
             // return redirect()->route('dashboard.peserta'); // Opsional redirect
        }

        // Ambil Data Submission (Tugas Masuk)
        $submissions = StudentWorkshopProgress::with(['user', 'workshop'])
            ->whereNotNull('photo_url') // Hanya yang sudah setor foto
            ->orderBy('updated_at', 'desc')
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'student_name' => $item->user->name,
                    'student_class' => $item->user->kelas->nama ?? 'Regular',
                    'workshop_title' => $item->workshop->title,
                    'photo_url' => $item->photo_url,
                    'status' => $item->status, // pending, completed, rejected
                    'submitted_at' => $item->updated_at->diffForHumans(),
                ];
            });

        // Statistik Pengajar
        $stats = [
            'total_students' => User::where('role', 'student')->count(),
            'pending_reviews' => $submissions->where('status', 'pending')->count(),
            'completed_workshops' => $submissions->where('status', 'completed')->count(),
        ];

        return Inertia::render('Pengajar/Dashboard', [
            'auth' => ['user' => $user],
            'submissions' => $submissions,
            'stats' => $stats
        ]);
    }

    // Aksi Penilaian (Grading)
    public function gradeSubmission(Request $request)
    {
        $request->validate([
            'submission_id' => 'required|exists:student_workshop_progresses,id',
            'status' => 'required|in:completed,rejected',
        ]);

        $progress = StudentWorkshopProgress::find($request->submission_id);
        $progress->status = $request->status;
        $progress->save();

        return redirect()->back()->with('message', 'Status tugas berhasil diperbarui!');
    }

    // ==========================================
    // 3. FITUR PENDUKUNG PESERTA
    // ==========================================
    
    public function workshopFlow()
    {
        return redirect()->route('workshop.play', ['id' => 1]);
    }

    public function nilaiSpk()
    {
        $user = Auth::user();
        $spk = StudentSpkResult::where('user_id', $user->id)->first();

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

        // Mockup Data Recap (bisa diganti real DB)
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

        // Ambil Data Real
        $workshopProgress = StudentWorkshopProgress::where('user_id', $user->id)
                            ->with('workshop')
                            ->get();

        $completedCount = $workshopProgress->where('status', 'completed')->count();
        $totalWorkshops = Workshop::count();
        
        // Hitung XP
        $xp = 0;
        foreach($workshopProgress as $prog) {
            if($prog->status == 'completed') $xp += 500;
            $xp += ($prog->pretest_score ?? 0);
            $xp += ($prog->posttest_score ?? 0);
        }
        $level = 1 + floor($xp / 1000);

        // Format List
        $formattedProgress = Workshop::all()->map(function($ws) use ($workshopProgress) {
            $myProg = $workshopProgress->where('workshop_id', $ws->id)->first();
            $status = 'Terkunci';
            $percent = 0;

            if ($ws->id == 1 && !$myProg) {
                $status = 'Sedang Belajar';
            } elseif ($myProg) {
                if ($myProg->status == 'completed') {
                    $status = 'Selesai';
                    $percent = 100;
                } else {
                    $status = 'Sedang Belajar';
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

        // Achievements Logic
        $achievements = [
            ['id' => 1, 'title' => 'Pemula', 'emoji' => '🌱', 'unlocked' => true],
            ['id' => 2, 'title' => 'Rajin', 'emoji' => '📚', 'unlocked' => $workshopProgress->count() > 0],
            ['id' => 3, 'title' => 'Barista', 'emoji' => '☕', 'unlocked' => $completedCount >= 1],
            ['id' => 4, 'title' => 'Master', 'emoji' => '👨‍🍳', 'unlocked' => $completedCount >= 3],
            ['id' => 5, 'title' => 'Sempurna', 'emoji' => '💯', 'unlocked' => $workshopProgress->where('posttest_score', 100)->count() > 0],
            ['id' => 6, 'title' => 'Bintang', 'emoji' => '⭐', 'unlocked' => $level >= 5],
        ];

        return Inertia::render('Peserta/ProfilPeserta', [
            'auth' => ['user' => $user],
            'stats' => [
                'level' => $level,
                'xp' => $xp,
                'streak' => 1,
                'completed_workshops' => $completedCount,
                'total_workshops' => $totalWorkshops
            ],
            'achievements' => $achievements,
            'progress_list' => $formattedProgress
        ]);
    }
}
<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Workshop;
use App\Models\StudentSpkResult;
use App\Models\StudentWorkshopProgress;
use App\Models\Kelas; // Ensure this model exists and is imported correctly
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash; // Import Hash for password creation
use Inertia\Inertia;

class DashboardController extends Controller
{
    // ==========================================
    // 1. DASHBOARD PESERTA (SISWA)
    // ==========================================
    public function indexPeserta()
    {
        $user = Auth::user();

        // Retrieve All Workshops & Progress
        $allWorkshops = Workshop::all();
        
        $formattedWorkshops = $allWorkshops->map(function ($ws) use ($user) {
            $progress = StudentWorkshopProgress::where('user_id', $user->id)
                        ->where('workshop_id', $ws->id)
                        ->first();

            $status = 'locked'; 

            // Unlock Logic
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

        // Statistics
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

        // Ensure only instructors/admins access
        if ($user->role !== 'instructor' && $user->role !== 'admin') {
             // return redirect()->route('dashboard.peserta');
        }

        // Retrieve Submission Data
        $submissions = StudentWorkshopProgress::with(['user', 'workshop'])
            ->whereNotNull('photo_url')
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

        // Instructor Statistics
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

    // Grading Action
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

        // Mockup Data Recap
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

        // Retrieve Real Data
        $workshopProgress = StudentWorkshopProgress::where('user_id', $user->id)
                            ->with('workshop')
                            ->get();

        $completedCount = $workshopProgress->where('status', 'completed')->count();
        $totalWorkshops = Workshop::count();
        
        // Calculate XP
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

    // ==========================================
    // 4. MANAJEMEN KELAS (CRUD LENGKAP) ✅
    // ==========================================
    
    // READ: Display class list
    public function kelas()
    {
        $user = Auth::user();

        // Retrieve class data along with student and workshop counts
        $dataKelas = Kelas::withCount(['students', 'workshops'])
                          ->orderBy('created_at', 'desc')
                          ->get();

        return Inertia::render('Pengajar/ManajemenKelas', [
            'auth' => ['user' => $user],
            'kelas_list' => $dataKelas // Data sent to React
        ]);
    }

    // CREATE: Store new class
    public function storeKelas(Request $request)
    {
        $request->validate([
            'nama' => 'required|string|max:255',
            'pelatih' => 'required|string|max:255',
            'periode' => 'required|string',
            'theme' => 'required|string',
        ]);

        Kelas::create([
            'nama' => $request->nama,
            'pelatih' => $request->pelatih,
            'periode' => $request->periode,
            'deskripsi' => $request->deskripsi,
            'theme' => $request->theme,
            'status' => 'Aktif',
            'emoji' => '🎓' // Default emoji if not input
        ]);

        return redirect()->back()->with('message', 'Kelas berhasil dibuat!');
    }

    // UPDATE: Edit class
    public function updateKelas(Request $request, $id)
    {
        $kelas = Kelas::findOrFail($id);
        
        $request->validate([
            'nama' => 'required|string|max:255',
            'pelatih' => 'required|string|max:255',
            'periode' => 'required|string',
        ]);

        $kelas->update([
            'nama' => $request->nama,
            'pelatih' => $request->pelatih,
            'periode' => $request->periode,
            'deskripsi' => $request->deskripsi,
            // Theme can be updated if sent, otherwise keep old
            'theme' => $request->theme ?? $kelas->theme, 
        ]);

        return redirect()->back()->with('message', 'Kelas berhasil diperbarui!');
    }

    // DELETE: Delete class
    public function destroyKelas($id)
    {
        $kelas = Kelas::findOrFail($id);
        $kelas->delete();

        return redirect()->back()->with('message', 'Kelas berhasil dihapus!');
    }

    // ==========================================
    // 5. MANAJEMEN PESERTA (SISWA)
    // ==========================================
    
    // READ: Display Page
    public function siswa()
    {
        $user = Auth::user();

        // Retrieve student data
        $students = User::where('role', 'student')
                        ->with('kelas')
                        ->orderBy('created_at', 'desc')
                        ->get()
                        ->map(function ($student) {
                            return [
                                'id' => $student->id,
                                'name' => $student->name,
                                'email' => $student->email,
                                'kelas_id' => $student->kelas_id,
                                'kelas_nama' => $student->kelas->nama ?? 'Belum ada kelas',
                                'kelas_color' => $student->kelas->theme ?? 'gray', // Get class theme
                                'status_pkl' => $student->status_pkl,
                                'nilai_pre' => $student->pre_test_score ?? 0,
                                'nilai_post' => $student->post_test_score ?? 0,
                                'joined_at' => $student->created_at->format('Y-m-d'),
                            ];
                        });

        // Retrieve class data for Dropdown & Filter
        $kelasList = Kelas::select('id', 'nama', 'pelatih', 'theme')->get();

        return Inertia::render('Pengajar/ManajemenPeserta', [
            'auth' => ['user' => $user],
            'students' => $students,
            'kelas_list' => $kelasList // Send class data to React
        ]);
    }

    // CREATE: Add New Student
    public function storeSiswa(Request $request)
    {
        // 1. Validate Input
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'phone' => 'nullable|string|max:20',
            'age' => 'nullable|integer',
            'school_grade' => 'nullable|string|max:50',
            'disability' => 'nullable|string|max:100',
            'kelas_id' => 'required|exists:kelas,id',
            'status_pkl' => 'required|string'
        ]);

        // 2. Save to Database
        User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'] ?? null,
            'age' => $validated['age'] ?? null,
            'school_grade' => $validated['school_grade'] ?? null,
            'disability' => $validated['disability'] ?? null,
            
            'kelas_id' => $validated['kelas_id'],
            'status_pkl' => $validated['status_pkl'],
            
            'password' => Hash::make('password'), // Default password
            'role' => 'student', // Mandatory set role as student
        ]);

        return redirect()->back()->with('success', 'Siswa berhasil ditambahkan!');
    }

    // UPDATE: Edit Student
    public function updateSiswa(Request $request, $id)
    {
        $student = User::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,'.$id,
            'phone' => 'nullable|string',
            'age' => 'nullable|integer',
            'school_grade' => 'nullable|string',
            'disability' => 'nullable|string',
            'kelas_id' => 'required|exists:kelas,id',
            'status_pkl' => 'required|string'
        ]);

        $student->update($validated);

        return redirect()->back()->with('success', 'Data siswa diperbarui!');
    }

    // DELETE: Delete Student
    public function destroySiswa($id)
    {
        $student = User::findOrFail($id);
        $student->delete();
        return redirect()->back()->with('message', 'Siswa dihapus!');
    }

    // DETAIL SISWA (Personal Statistics)
    public function detailSiswa($id)
    {
        $user = Auth::user();
        
        // 1. Retrieve Target Student Data (Complete with relations)
        // Ensure relationships 'kelas', 'workshopProgress.workshop', 'spkResult' exist in User model
        $student = User::with(['kelas', 'workshopProgress.workshop', 'spkResult'])
                       ->where('role', 'student')
                       ->findOrFail($id);

        // 2. Calculate Basic Statistics
        $totalWorkshops = Workshop::count();
        $completedWorkshops = $student->workshopProgress->where('status', 'completed')->count();
        $progressPercent = $totalWorkshops > 0 ? round(($completedWorkshops / $totalWorkshops) * 100) : 0;
        
        // Calculate Average Score (Pre + Post) - Adjust logic if needed
        $totalScore = 0;
        $countScore = 0;
        foreach($student->workshopProgress as $prog) {
            if($prog->post_test_score !== null) { // Assuming checking post_test_score for average
                $totalScore += $prog->post_test_score;
                $countScore++;
            }
        }
        $avgScore = $countScore > 0 ? round($totalScore / $countScore) : 0;

        // 3. Determine Persona (Based on SPK or Scores)
        $persona = "Novice Brewer";
        // $this->calculatePersona($student) logic is integrated here or can be separate helper
        $spk = $student->spkResult;
        if($spk) {
            if ($spk->nilai_keseluruhan > 90) $persona = "Coffee Master";
            elseif ($spk->predikat_keterampilan == 'Sangat Baik') $persona = "Artisan Crafter";
            elseif ($spk->predikat_pengetahuan == 'Sangat Baik') $persona = "Coffee Scholar";
        } elseif ($completedWorkshops > 5) {
             $persona = 'Expert Brewer';
        } elseif ($completedWorkshops > 2) {
             $persona = 'Intermediate';
        }

        // 4. Format History (Timeline)
        $history = $student->workshopProgress
            ->sortByDesc('updated_at')
            ->map(function($item) {
                return [
                    'id' => $item->id,
                    'title' => $item->workshop->title,
                    'status' => $item->status,
                    'date' => $item->updated_at->format('d M Y, H:i'),
                    'score' => $item->post_test_score,
                    'type' => $item->status == 'completed' ? 'completion' : 'submission'
                ];
            })->values();

        // 5. Prepare Student Data for View
        $studentData = [
            'id' => $student->id,
            'name' => $student->name,
            'email' => $student->email,
            'phone' => $student->phone ?? '-',
            'avatar' => strtoupper(substr($student->name, 0, 1)),
            'kelas' => $student->kelas->nama ?? '-',
            'join_date' => $student->created_at->format('d M Y'),
            'status_pkl' => $student->status_pkl,
            'age' => $student->age ?? '-',
            'school_grade' => $student->school_grade ?? '-',
            'disability' => $student->disability,
            'persona' => $persona,
        ];

        // 6. Workshop List for "Overview Modul" Tab
        // Map all workshops and attach student status
        $allWorkshops = Workshop::all();
        $workshopsData = $allWorkshops->map(function($ws) use ($student) {
            $studentWs = $student->workshopProgress->where('workshop_id', $ws->id)->first();
            
            return [
                'title' => $ws->title,
                'status' => $studentWs ? $studentWs->status : 'pending', // 'pending' or 'locked' as default
                'score' => $studentWs ? $studentWs->post_test_score : 0, // Using post_test_score
                'last_update' => $studentWs ? $studentWs->updated_at->format('d M Y') : '-',
            ];
        });

        // Stats Array
        $stats = [
            'progress' => $progressPercent,
            'avg_score' => $avgScore,
            'completed_modules' => $completedWorkshops,
            'total_modules' => $totalWorkshops,
            'xp' => ($completedWorkshops * 500) + ($avgScore * 10) // Consistent XP logic
        ];

        return Inertia::render('Pengajar/DetailSiswa', [
            'auth' => ['user' => $user],
            'student' => $studentData,
            'stats' => $stats,
            'workshops' => $workshopsData,
            'history' => $history // Reusing history from point 4
        ]);
    }

    public function analisis()
    {
        $user = Auth::user();

        // Retrieve student data and calculate SPK values dynamically
        $students = User::where('role', 'student')
            ->with(['kelas']) // Add 'spkResult' here if relation exists
            ->get()
            ->map(function ($s) {
                // Simulation values (Replace with $s->spkResult->nilai if DB is ready)
                $visual = rand(60, 95); 
                $soft = rand(65, 95);
                $total = ($visual * 0.6) + ($soft * 0.4);
                
                // Status Logic
                if ($total >= 85) {
                    $status = 'Siap PKL';
                    $rek = 'Kompetensi sangat baik, siap magang.';
                } elseif ($total >= 75) {
                    $status = 'Perlu Pendampingan';
                    $rek = 'Butuh pengawasan saat praktek alat.';
                } else {
                    $status = 'Perlu Pelatihan Lanjutan';
                    $rek = 'Wajib mengulang materi dasar.';
                }

                return [
                    'id' => $s->id,
                    'nama' => $s->name,
                    'kelas' => $s->kelas->nama ?? 'Belum ada kelas',
                    'visualRecognition' => $visual,
                    'softSkill' => $soft,
                    'totalNilai' => round($total, 1),
                    'status' => $status,
                    'rekomendasi' => $rek
                ];
            });

        return Inertia::render('Pengajar/AnalisisSPK', [
            'auth' => ['user' => $user],
            'students' => $students // ✅ This data MUST be sent
        ]);
    }

    // Helper for Persona (Optional - logic moved inside detailSiswa)
    private function calculatePersona($student) {
        // Logic implemented directly in detailSiswa for better context access
        return 'Novice Brewer';
    }
}
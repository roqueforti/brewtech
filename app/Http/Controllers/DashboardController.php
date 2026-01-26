<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Module;
use App\Models\StudentSpkResult;
use App\Models\StudentModuleProgress;
use App\Models\Kelas;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;
use Inertia\Inertia;

class DashboardController extends Controller
{
    // ==========================================
    // 0. REDIRECTOR (SOLUSI ERROR INDEX)
    // ==========================================
    public function index()
    {
        $user = Auth::user();
        
        if ($user->role === 'student') {
            return redirect()->route('peserta.dashboard'); 
        } elseif ($user->role === 'instructor' || $user->role === 'admin') {
            return redirect()->route('pengajar.dashboard'); 
        }

        return abort(403, 'Unauthorized action.');
    }

    // ==========================================
    // 1. DASHBOARD PESERTA (SISWA)
    // ==========================================
    public function indexPeserta()
    {
        $user = Auth::user();
        
        // Load Kelas & Modules
        if ($user->kelas) {
            $user->kelas->load(['modules' => function($q) {
                $q->withPivot('is_active', 'opens_at');
            }]);
            $classModules = $user->kelas->modules;
        } else {
            $classModules = collect([]);
        }

        // Ambil Progress Siswa
        $studentProgress = StudentModuleProgress::where('user_id', $user->id)->get();

        $formattedModules = $classModules->map(function ($mod) use ($studentProgress) {
            $progress = $studentProgress->where('module_id', $mod->id)->first();
            $isCompleted = $progress && $progress->status === 'completed';
            $pivot = $mod->pivot;
            
            $isTimeOpen = true;
            if ($pivot->opens_at) {
                $scheduleDate = Carbon::parse($pivot->opens_at);
                $now = Carbon::now('Asia/Jakarta');
                $isTimeOpen = $now->greaterThanOrEqualTo($scheduleDate);
            }

            $status = 'locked';
            $date = null;

            if ($isCompleted) {
                $status = 'completed';
                $date = $progress->updated_at->format('d M Y');
            } elseif ($pivot->is_active && $isTimeOpen) {
                $status = 'available';
            }

            return [
                'id' => $mod->id,
                'title' => $mod->title,
                'subtitle' => $mod->description ?? 'Pelajari materi ini untuk lanjut.',
                'emoji' => $mod->emoji ?? '☕',
                'status' => $status,
                'theme' => $mod->category == 'Hard Skill' ? 'orange' : 'blue',
                'date' => $date,
                'opens_at' => $pivot->opens_at ? Carbon::parse($pivot->opens_at)->translatedFormat('d M Y, H:i') . ' WIB' : 'Sekarang'
            ];
        });

        $stats = [
            'completed' => $formattedModules->where('status', 'completed')->count(),
            'active'    => $formattedModules->where('status', 'available')->count(),
        ];

        return Inertia::render('Peserta/Dashboard', [
            'auth' => ['user' => $user],
            'workshops' => $formattedModules,
            'stats' => $stats
        ]);
    }

    // ==========================================
    // 2. DASHBOARD PENGAJAR (GURU)
    // ==========================================
    public function indexPengajar()
    {
        $user = Auth::user();

        if (!in_array($user->role, ['instructor', 'admin'])) {
             return redirect()->route('peserta.dashboard');
        }

        $submissions = StudentModuleProgress::with(['user.kelas', 'module'])
            ->whereNotNull('photo_url')
            ->where('status', 'pending')
            ->orderBy('updated_at', 'desc')
            ->take(5)
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'student_name' => $item->user->name,
                    'student_class' => $item->user->kelas->nama ?? 'Regular',
                    'workshop_title' => $item->module->title,
                    'photo_url' => $item->photo_url,
                    'status' => $item->status,
                    'submitted_at' => $item->updated_at->diffForHumans(),
                ];
            });

        $stats = [
            'total_kelas' => Kelas::count(),
            'total_peserta' => User::where('role', 'student')->count(),
            'siap_pkl' => User::where('role', 'student')->where('status_pkl', 'siap')->count(),
            'perlu_bantuan' => User::where('role', 'student')->where('status_pkl', '!=', 'siap')->count(),
        ];

        $chartData = [
            'labels' => ['Minggu 1', 'Minggu 2', 'Minggu 3', 'Minggu 4'],
            'scores' => [65, 70, 85, 92]
        ];

        $activeClasses = Kelas::withCount(['students', 'modules'])->take(4)->get()->map(function($k) {
            return [
                'id' => $k->id,
                'name' => $k->nama,
                'teacher' => $k->pelatih,
                'workshop_count' => $k->modules_count,
                'student_count' => $k->students_count,
                'theme' => $k->theme ?? 'blue',
            ];
        });

        return Inertia::render('Pengajar/Dashboard', [
            'auth' => ['user' => $user],
            'stats' => $stats,
            'active_classes' => $activeClasses,
            'chart_data' => $chartData,
        ]);
    }

    public function gradeSubmission(Request $request)
    {
        $request->validate([
            'submission_id' => 'required|exists:student_module_progress,id',
            'status' => 'required|in:completed,rejected',
        ]);

        $progress = StudentModuleProgress::find($request->submission_id);
        $progress->status = $request->status;
        $progress->save();

        return redirect()->back()->with('message', 'Status tugas berhasil diperbarui!');
    }

    // ==========================================
    // 3. MANAJEMEN KELAS
    // ==========================================

    public function kelas()
    {
        $user = Auth::user();
        
        $dataKelas = Kelas::withCount(['students', 'modules'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($k) {
                $pendingCount = StudentModuleProgress::whereHas('user', function($q) use ($k) {
                        $q->where('kelas_id', $k->id);
                    })
                    ->where('status', 'completed')
                    ->whereNull('soft_skill_score')
                    ->count();

                return [
                    'id' => $k->id,
                    'nama' => $k->nama,
                    'pelatih' => $k->pelatih,
                    'periode' => $k->periode,
                    'deskripsi' => $k->deskripsi,
                    'theme' => $k->theme ?? 'blue',
                    'status' => $k->status ?? 'Aktif',
                    'emoji' => $k->emoji ?? '🎓',
                    'students_count' => $k->students_count, 
                    'modules_count' => $k->modules_count,   
                    'pending_grading' => $pendingCount,     
                ];
            });

        return Inertia::render('Pengajar/ManajemenKelas', [
            'auth' => ['user' => $user], 
            'kelas_list' => $dataKelas
        ]);
    }

    public function storeKelas(Request $request)
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'pelatih' => 'required|string|max:255',
            'periode' => 'required|string|max:100',
            'deskripsi' => 'nullable|string',
            'theme' => 'required|in:blue,green,orange,purple,pink,yellow', 
        ]);

        $validated['status'] = 'Aktif';
        $validated['emoji'] = '🎓'; 

        Kelas::create($validated);

        return redirect()->back()->with('message', 'Kelas berhasil dibuat!');
    }

    public function updateKelas(Request $request, $id)
    {
        $kelas = Kelas::findOrFail($id);

        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'pelatih' => 'required|string|max:255',
            'periode' => 'required|string|max:100',
            'deskripsi' => 'nullable|string',
            'theme' => 'required|in:blue,green,orange,purple,pink,yellow',
        ]);

        $kelas->update($validated);

        return redirect()->back()->with('message', 'Informasi kelas berhasil diperbarui!');
    }

    public function destroyKelas($id)
    {
        $kelas = Kelas::findOrFail($id);
        $kelas->delete();
        return redirect()->back()->with('message', 'Kelas berhasil dihapus permanen.');
    }

    public function detailKelas($id)
    {
        $user = Auth::user();
        $kelas = Kelas::with(['students', 'modules'])->withCount(['students', 'modules'])->findOrFail($id);
        
        $rawGlobal = Setting::where('key', 'global_soft_skills')->value('value');
        $globalCriteria = $rawGlobal ? json_decode($rawGlobal) : ['Kedisiplinan', 'Kerapian', 'Kerjasama'];

        $kelasProgress = StudentModuleProgress::whereIn('user_id', $kelas->students->pluck('id'))
            ->whereIn('module_id', $kelas->modules->pluck('id'))
            ->with(['user', 'module'])
            ->orderBy('updated_at', 'desc')
            ->get()
            ->map(function ($prog) use ($globalCriteria) {
                return [
                    'id' => $prog->id,
                    'user_id' => $prog->user_id,
                    'module_id' => $prog->module_id,
                    'student_name' => $prog->user->name,
                    'student_avatar' => strtoupper(substr($prog->user->name, 0, 1)),
                    'module_title' => $prog->module->title,
                    'status' => $prog->status,
                    
                    // --- 1. HARD SKILL (TES) ---
                    'hard_pre' => $prog->pretest_score,   // Menggunakan kolom lama
                    'hard_post' => $prog->posttest_score, // Menggunakan kolom lama
                    
                    // --- 2. SOFT SKILL (TES) ---
                    'soft_test_pre' => $prog->pre_test_soft_score,  // Kolom Baru
                    'soft_test_post' => $prog->post_test_soft_score, // Kolom Baru

                    // --- 3. OBSERVASI (MANUAL) ---
                    'obs_trainer' => $prog->trainer_score,
                    'obs_teacher' => $prog->teacher_score,
                    'obs_avg' => $prog->soft_skill_score, // Rata-rata observasi

                    // Detail lainnya
                    'trainer_details' => $prog->trainer_soft_details,
                    'trainer_notes' => $prog->trainer_notes,
                    'teacher_details' => $prog->teacher_soft_details,
                    'teacher_notes' => $prog->teacher_notes,
                    'module_criteria' => $globalCriteria, 
                    'date' => $prog->updated_at->format('d M Y, H:i'),
                ];
            });

        $allModules = Module::all(); 
        $availableStudents = User::where('role', 'student')->whereNull('kelas_id')->get();

        return Inertia::render('Pengajar/DetailKelas', [
            'auth' => ['user' => $user],
            'kelas' => $kelas,
            'kelasProgress' => $kelasProgress,
            'availableModules' => $allModules,
            'availableStudents' => $availableStudents
        ]);
    }

    public function addModuleToKelas(Request $request, $id)
    {
        $kelas = Kelas::findOrFail($id);
        $request->validate(['module_id' => 'required|exists:modules,id']);
        $kelas->modules()->syncWithoutDetaching([$request->module_id => ['is_active' => true, 'opens_at' => now()]]);
        return redirect()->back()->with('success', 'Modul ditambahkan.');
    }

    public function removeModuleFromKelas($id, $moduleId)
    {
        $kelas = Kelas::findOrFail($id);
        $kelas->modules()->detach($moduleId);
        return redirect()->back()->with('success', 'Modul dihapus.');
    }

public function addStudentToKelas(Request $request, $id)
    {
        // 1. Validasi input: Pastikan 'student_ids' adalah array dan setiap ID-nya valid
        $request->validate([
            'student_ids' => 'required|array', 
            'student_ids.*' => 'exists:users,id'
        ]);

        // 2. Lakukan update massal (Bulk Update)
        // Mencari semua user yang ID-nya ada di dalam list yang dikirim, lalu set kelas_id-nya
        User::whereIn('id', $request->student_ids)->update(['kelas_id' => $id]);

        // 3. Kembalikan pesan sukses dengan jumlah siswa yang ditambahkan
        $count = count($request->student_ids);
        return redirect()->back()->with('success', "$count Siswa berhasil dimasukkan ke kelas.");
    }   

    public function removeStudentFromKelas($id, $studentId)
    {
        $student = User::where('id', $studentId)->where('kelas_id', $id)->first();
        if ($student) {
            $student->update(['kelas_id' => null]);
            return redirect()->back()->with('success', 'Siswa dikeluarkan.');
        }
        return redirect()->back()->with('error', 'Siswa tidak ditemukan.');
    }

    public function updateSoftSkill(Request $request)
{
    $user = Auth::user();
    $progress = StudentModuleProgress::findOrFail($request->progress_id);
    
    // Hitung rata-rata inputan saat ini
    $details = $request->details; 
    $average = count($details) > 0 ? round(array_sum($details) / count($details)) : 0;

    if ($user->role === 'instructor') {
        // Jika Pelatih yang input
        $progress->trainer_soft_details = $details;
        $progress->trainer_score = $average;
        $progress->trainer_notes = $request->soft_skill_notes;
    } 
    elseif ($user->role === 'teacher') { // Asumsi ada role 'teacher'
        // Jika Guru yang input
        $progress->teacher_soft_details = $details;
        $progress->teacher_score = $average;
        $progress->teacher_notes = $request->soft_skill_notes;
    }

    // HITUNG NILAI AKHIR (GABUNGAN)
    // Contoh: Bobot 50:50. Jika salah satu belum nilai, pakai nilai yang ada saja.
    $tScore = $progress->trainer_score;
    $gScore = $progress->teacher_score;

    if ($tScore && $gScore) {
        $finalScore = ($tScore + $gScore) / 2;
    } else {
        $finalScore = $tScore ?? $gScore ?? 0;
    }

    $progress->soft_skill_score = round($finalScore);
    $progress->save();

    return redirect()->back()->with('success', 'Penilaian Soft Skill tersimpan!');
}

    public function updateModuleSchedule(Request $request, $kelasId, $moduleId)
    {
        $request->validate([
            'opens_at' => 'nullable|date',
            'is_active' => 'required|boolean'
        ]);

        $kelas = Kelas::findOrFail($kelasId);
        $kelas->modules()->updateExistingPivot($moduleId, [
            'opens_at' => $request->opens_at,
            'is_active' => $request->is_active
        ]);

        return redirect()->back()->with('success', 'Jadwal modul diperbarui!');
    }

    // ==========================================
    // 5. MANAJEMEN SISWA
    // ==========================================
    public function siswa()
    {
        $user = Auth::user();
        
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
                    'kelas_color' => $student->kelas->theme ?? 'gray',
                    'status_pkl' => $student->status_pkl,
                    
                    // ✅ UPDATE MAPPING DATA BARU
                    'school_grade' => $student->school_grade, 
                    'disability' => $student->disability,
                    'phone' => $student->phone,

                    'nilai_pre' => $student->pre_test_score ?? 0,
                    'nilai_post' => $student->post_test_score ?? 0,
                    'joined_at' => $student->created_at->format('Y-m-d')
                ];
            });

        $kelasList = Kelas::select('id', 'nama', 'pelatih', 'theme')->get();

        return Inertia::render('Pengajar/ManajemenPeserta', [
            'auth' => ['user' => $user],
            'students' => $students,
            'kelas_list' => $kelasList
        ]);
    }

    public function storeSiswa(Request $request)
    {
        // ✅ UPDATE VALIDASI DATA BARU
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'kelas_id' => 'required', 
            'status_pkl' => 'required',
            
            // Field Baru (Nullable agar tidak error)
            'school_grade' => 'nullable|string|max:100',
            'disability' => 'nullable|string|max:100',
            'phone' => 'nullable|string|max:20',
        ]);

        User::create(array_merge($validated, [
            'password' => Hash::make('password'), 
            'role' => 'student'
        ]));

        return redirect()->back()->with('success', 'Siswa ditambahkan!');
    }

    public function updateSiswa(Request $request, $id)
    {
        $student = User::findOrFail($id);
        
        // ✅ UPDATE VALIDASI DATA BARU
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,'.$id,
            'kelas_id' => 'required',
            'status_pkl' => 'required',
            
            // Field Baru
            'school_grade' => 'nullable|string|max:100',
            'disability' => 'nullable|string|max:100',
            'phone' => 'nullable|string|max:20',
        ]);

        $student->update($validated);
        
        return redirect()->back()->with('success', 'Data diperbarui!');
    }

    public function destroySiswa($id)
    {
        User::findOrFail($id)->delete();
        return redirect()->back()->with('message', 'Siswa dihapus!');
    }

    public function detailSiswa($id)
    {
        $user = Auth::user();
        $student = User::with(['kelas', 'progress.module', 'spkResult'])->where('role', 'student')->findOrFail($id);

        $totalModules = Module::count(); 
        $completedModules = $student->progress->where('status', 'completed')->count();
        $progressPercent = $totalModules > 0 ? round(($completedModules / $totalModules) * 100) : 0;
        
        $totalScore = 0; $countScore = 0;
        foreach($student->progress as $prog) { 
            if($prog->posttest_score !== null) { $totalScore += $prog->posttest_score; $countScore++; }
        }
        $avgScore = $countScore > 0 ? round($totalScore / $countScore) : 0;

        $persona = "Novice Brewer";
        $spk = $student->spkResult;
        if($spk) {
            if ($spk->nilai_keseluruhan > 90) $persona = "Coffee Master";
            elseif ($spk->predikat_keterampilan == 'Sangat Baik') $persona = "Artisan Crafter";
            elseif ($spk->predikat_pengetahuan == 'Sangat Baik') $persona = "Coffee Scholar";
        }

        $history = $student->progress->sortByDesc('updated_at')->map(function($item) {
            return ['id' => $item->id, 'title' => $item->module->title, 'status' => $item->status, 'date' => $item->updated_at->format('d M Y, H:i'), 'score' => $item->posttest_score, 'type' => $item->status == 'completed' ? 'completion' : 'submission'];
        })->values();

        $studentData = [
            'id' => $student->id, 'name' => $student->name, 'email' => $student->email, 'phone' => $student->phone ?? '-', 'avatar' => strtoupper(substr($student->name, 0, 1)), 'kelas' => $student->kelas->nama ?? '-', 'join_date' => $student->created_at->format('d M Y'), 'status_pkl' => $student->status_pkl, 'age' => $student->age ?? '-', 'school_grade' => $student->school_grade ?? '-', 'disability' => $student->disability, 'persona' => $persona
        ];

        $allModules = Module::all(); 
        $modulesData = $allModules->map(function($mod) use ($student) {
            $studentMod = $student->progress->where('module_id', $mod->id)->first(); 
            return ['title' => $mod->title, 'status' => $studentMod ? $studentMod->status : 'pending', 'score' => $studentMod ? $studentMod->posttest_score : 0, 'last_update' => $studentMod ? $studentMod->updated_at->format('d M Y') : '-'];
        });

        $stats = ['progress' => $progressPercent, 'avg_score' => $avgScore, 'completed_modules' => $completedModules, 'total_modules' => $totalModules];

        return Inertia::render('Pengajar/DetailSiswa', [
            'auth' => ['user' => $user],
            'student' => $studentData,
            'stats' => $stats,
            'workshops' => $modulesData, 
            'history' => $history
        ]);
    }

    // ==========================================
    // 6. ANALISIS SPK
    // ==========================================
    public function analisis()
    {
        $user = Auth::user();
        $bobotVisual = (int) (Setting::where('key', 'spk_bobot_visual')->value('value') ?? 60) / 100;
        $bobotSoft = (int) (Setting::where('key', 'spk_bobot_soft')->value('value') ?? 40) / 100;
        $limitSiap = (int) (Setting::where('key', 'spk_threshold_siap')->value('value') ?? 85);
        $limitPantau = (int) (Setting::where('key', 'spk_threshold_pantau')->value('value') ?? 75);

        $students = User::where('role', 'student')->with(['kelas', 'progress.module'])->get()->map(function ($s) use ($bobotVisual, $bobotSoft, $limitSiap, $limitPantau) {
            $completedModules = $s->progress; 
            $totalVisual = 0; $totalSoft = 0; $count = $completedModules->count();
            $moduleDetails = [];

            foreach ($completedModules as $prog) {
                $visualScore = $prog->posttest_score ?? 0;
                $softSkillScore = $prog->soft_skill_score ?? 0;
                $finalScore = ($visualScore * $bobotVisual) + ($softSkillScore * $bobotSoft);
                $totalVisual += $visualScore; $totalSoft += $softSkillScore;
                
                $moduleDetails[] = ['module_name' => $prog->module->title ?? 'Modul', 'visual' => $visualScore, 'softskill' => $softSkillScore, 'total' => round($finalScore, 1), 'status' => $finalScore >= 80 ? 'Kompeten' : 'Cukup'];
            }

            $avgVisual = $count > 0 ? round($totalVisual / $count) : 0;
            $avgSoft = $count > 0 ? round($totalSoft / $count) : 0;
            $avgTotal = ($avgVisual * $bobotVisual) + ($avgSoft * $bobotSoft);

            if ($count === 0) { $status = 'Belum Ada Data'; $badgeColor = 'gray'; $rek = 'Belum ada data nilai yang masuk.'; } 
            elseif ($avgTotal >= $limitSiap) { $status = 'Siap PKL'; $badgeColor = 'green'; $rek = 'Sangat direkomendasikan untuk magang.'; } 
            elseif ($avgTotal >= $limitPantau) { $status = 'Butuh Pendampingan'; $badgeColor = 'purple'; $rek = 'Perlu pengawasan supervisor saat PKL.'; } 
            else { $status = 'Perlu Pelatihan Ulang'; $badgeColor = 'orange'; $rek = 'Belum memenuhi standar minimal industri.'; }

            return ['id' => $s->id, 'nama' => $s->name, 'kelas' => $s->kelas->nama ?? 'Tanpa Kelas', 'module_count' => $count, 'avg_visual' => $avgVisual, 'avg_softskill' => $avgSoft, 'global_score' => round($avgTotal, 1), 'status' => $status, 'rekomendasi' => $rek, 'badge_color' => $badgeColor, 'details' => $moduleDetails];
        });

        $classStats = $students->groupBy('kelas')->map(function ($group, $className) {
            if ($className === 'Tanpa Kelas') return null;
            $totalSiswa = $group->count();
            $avgGlobal = round($group->avg('global_score'), 1);
            $avgVisual = round($group->avg('avg_visual'), 1);
            $avgSoft = round($group->avg('avg_softskill'), 1);
            $lulusCount = $group->filter(fn($s) => $s['status'] === 'Siap PKL')->count();
            $passRate = $totalSiswa > 0 ? round(($lulusCount / $totalSiswa) * 100) : 0;
            return ['nama_kelas' => $className, 'total_siswa' => $totalSiswa, 'avg_score' => $avgGlobal, 'avg_visual' => $avgVisual, 'avg_soft' => $avgSoft, 'pass_rate' => $passRate, 'best_student' => $group->sortByDesc('global_score')->first()['nama'] ?? '-'];
        })->filter()->values();

        return Inertia::render('Pengajar/AnalisisSPK', ['auth' => ['user' => $user], 'students' => $students, 'classStats' => $classStats]);
    }
}
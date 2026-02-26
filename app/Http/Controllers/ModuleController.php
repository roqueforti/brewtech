<?php

namespace App\Http\Controllers;

use App\Models\Module;
use App\Models\ModuleStep;
use App\Models\ModuleQuestion;
use App\Models\StudentModuleProgress;
use App\Models\Setting;
use App\Models\User; // Pastikan ini diimport
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ModuleController extends Controller
{
    // =======================================================================
    // 1. AREA PENGAJAR (INSTRUCTOR) - CRUD BANK MODUL
    // =======================================================================

    public function index()
    {
        $modules = Module::withCount(['steps', 'questions'])
            ->latest()
            ->get();

        $rawSoftSkills = Setting::where('key', 'global_soft_skills')->value('value');
        $globalSoftSkills = $rawSoftSkills ? json_decode($rawSoftSkills) : ['Kedisiplinan', 'Kerapian'];

        return Inertia::render('Pengajar/Modul/Index', [
            'modules' => $modules,
            'globalSoftSkills' => $globalSoftSkills
        ]);
    }

    public function updateGlobalSoftSkills(Request $request)
    {
        $request->validate([
            'criteria' => 'required|array',
            'criteria.*' => 'string|max:50'
        ]);

        Setting::updateOrCreate(
            ['key' => 'global_soft_skills'],
            ['value' => json_encode($request->criteria), 'type' => 'json']
        );

        return redirect()->back()->with('success', 'Kriteria penilaian global diperbarui!');
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
        ]);

        Module::create([
            'title' => $request->title,
            'description' => $request->description,
            'emoji' => '☕',
        ]);

        return redirect()->back()->with('success', 'Modul berhasil dibuat! Silakan edit untuk menambah materi.');
    }

    public function edit($id)
    {
        $module = Module::with(['steps', 'pre_test_questions', 'post_test_questions', 'tools'])->findOrFail($id);
        return Inertia::render('Pengajar/Modul/Edit', ['module' => $module]);
    }

    public function update(Request $request, $id)
    {
        DB::transaction(function () use ($request, $id) {
            $module = Module::findOrFail($id);

            // 1. Update Info Dasar
            $module->update([
                'title' => $request->title ?? $module->title,
                'description' => $request->description,
                'tools_materials' => $request->tools_materials ?? null,
            ]);

            // 2. Handle Tools (Alat & Bahan)
            $module->tools()->delete();
            if ($request->tools && is_array($request->tools)) {
                foreach ($request->tools as $toolData) {
                    $path = $this->handleFileUpload(
                        $toolData['media_file'] ?? null,
                        $toolData['media_url'] ?? null,
                        'module_tools'
                    );

                    $type = 'image';
                    if (isset($toolData['media_file']) && $toolData['media_file'] instanceof \Illuminate\Http\UploadedFile) {
                        $mime = $toolData['media_file']->getMimeType();
                        $type = str_contains($mime, 'video') ? 'video' : 'image';
                    }

                    $module->tools()->create([
                        'name' => $toolData['name'] ?? 'Alat Baru',
                        'media_url' => $path,
                        'media_type' => $path ? $type : null,
                    ]);
                }
            }

            // 3. Handle Steps (Langkah)
            $module->steps()->delete();
            if ($request->steps && is_array($request->steps)) {
                foreach ($request->steps as $stepData) {
                    $path = $this->handleFileUpload(
                        $stepData['media_file'] ?? null,
                        $stepData['media_url'] ?? null,
                        'module_steps'
                    );

                    $type = 'image';
                    if (isset($stepData['media_file']) && $stepData['media_file'] instanceof \Illuminate\Http\UploadedFile) {
                        $mime = $stepData['media_file']->getMimeType();
                        $type = str_contains($mime, 'video') ? 'video' : 'image';
                    }

                    $module->steps()->create([
                        'title' => $stepData['title'] ?? 'Langkah',
                        'description' => $stepData['description'] ?? '',
                        'media_url' => $path,
                        'media_type' => $path ? $type : null,
                    ]);
                }
            }

            // 4. Handle Questions (Pre & Post Test)
            $module->questions()->delete();
            
            if ($request->questions && is_array($request->questions)) {
                foreach ($request->questions as $key => $qData) {
                    
                    // A. Handle Media Soal Utama
                    $mainPath = null;
                    $mainType = null;

                    if ($request->hasFile("questions.{$key}.media_file")) {
                        $file = $request->file("questions.{$key}.media_file");
                        $mainPath = '/storage/' . $file->store('module_questions', 'public');
                        $mime = $file->getMimeType();
                        $mainType = str_contains($mime, 'video') ? 'video' : 'image';
                    } else {
                        $oldUrl = $qData['media_url'] ?? null;
                        if ($oldUrl && !str_starts_with($oldUrl, 'blob:')) {
                            $mainPath = $oldUrl;
                            $mainType = 'image'; 
                        }
                    }

                    // B. Handle Options & Media Options
                    $optionsText = [];
                    $existingOptions = $qData['options'] ?? [];

                    for ($i = 0; $i < 4; $i++) {
                        $optPath = null;

                        if ($request->hasFile("questions.{$key}.options_media_files.{$i}")) {
                            $file = $request->file("questions.{$key}.options_media_files.{$i}");
                            $optPath = '/storage/' . $file->store('module_options', 'public');
                        } 
                        else if (isset($existingOptions[$i]['media_url'])) {
                            $oldOptUrl = $existingOptions[$i]['media_url'];
                            if ($oldOptUrl && !str_starts_with($oldOptUrl, 'blob:')) {
                                $optPath = $oldOptUrl;
                            }
                        }

                        $optionsText[] = [
                            'text' => $existingOptions[$i]['text'] ?? '',
                            'media_url' => $optPath
                        ];
                    }

                    // C. Simpan ke Database
                    $module->questions()->create([
                        'type' => $qData['type'] ?? 'pre_test',
                        'question' => $qData['question'] ?? 'Pertanyaan...',
                        'options' => $optionsText,
                        'correct_answer' => $qData['correct_answer'] ?? 0,
                        'media_url' => $mainPath,
                        'media_type' => $mainPath ? $mainType : null,
                    ]);
                }
            }
        });

        return redirect()->back()->with('success', 'Modul berhasil diperbarui!');
    }

    public function destroy($id)
    {
        $module = Module::findOrFail($id);
        $module->delete();
        return redirect()->back()->with('success', 'Modul dihapus.');
    }

    public function preview($id)
    {
        $module = Module::with(['steps', 'pre_test_questions', 'post_test_questions', 'tools'])->findOrFail($id);
        return Inertia::render('Pengajar/Modul/Preview', ['module' => $module]);
    }

    public function showStudentResult($kelasId, $moduleId, $studentId, $type)
    {
        // 1. Validasi & Ambil Data
        $module = Module::findOrFail($moduleId);
        $student = User::findOrFail($studentId);
        
        $dbType = strtolower(str_replace('-', '_', $type));

        $progress = StudentModuleProgress::where('user_id', $studentId)
            ->where('module_id', $moduleId)
            ->firstOrFail();

        // 2. Ambil Soal
        $questions = ModuleQuestion::where('module_id', $moduleId)
            ->where('type', $dbType)
            ->get();

        // 3. Ambil Jawaban dari History JSON
        $userAnswers = $progress->history[$dbType] ?? [];

        // 4. Susun Data Review
        $reviewData = [];
        $correctCount = 0;

        foreach ($questions as $q) {
            $userAnsIdx = $userAnswers[$q->id] ?? null;
            $isCorrect = (!is_null($userAnsIdx) && (int)$userAnsIdx === (int)$q->correct_answer);
            
            if ($isCorrect) $correctCount++;

            $options = $q->options;
            
            $userAnswerText = '-';
            if (!is_null($userAnsIdx) && isset($options[$userAnsIdx])) {
                $userAnswerText = $options[$userAnsIdx]['text'] ?: '(Gambar Opsi)';
            }

            $correctAnswerText = 'Error Key';
            if (isset($options[$q->correct_answer])) {
                $correctAnswerText = $options[$q->correct_answer]['text'] ?: '(Gambar Opsi)';
            }

            $reviewData[] = [
                'id' => $q->id,
                'question' => $q->question,
                'media_url' => $q->media_url,
                'user_answer_text' => $userAnswerText,
                'correct_answer_text' => $correctAnswerText,
                'is_correct' => $isCorrect
            ];
        }

        $score = $dbType === 'pre_test' ? $progress->pretest_score : $progress->posttest_score;

        // 5. Render Halaman Khusus Pengajar
        return Inertia::render('Pengajar/Modul/StudentResult', [
            'kelas_id' => $kelasId,
            'student' => ['id' => $student->id, 'name' => $student->name, 'avatar' => $student->name[0]],
            'module' => ['id' => $module->id, 'title' => $module->title],
            'score' => $score ?? 0,
            'total_questions' => $questions->count(),
            'correct_count' => $correctCount,
            'wrong_count' => $questions->count() - $correctCount,
            'review_data' => $reviewData,
            'type' => $type
        ]);
    }

    // =======================================================================
    // 2. AREA PESERTA (STUDENT) & API
    // =======================================================================

    public function play($id)
    {
        $user = Auth::user();
        $module = Module::with(['steps', 'pre_test_questions', 'post_test_questions', 'tools'])->findOrFail($id);

        $progress = StudentModuleProgress::firstOrCreate(
            ['user_id' => $user->id, 'module_id' => $module->id],
            ['status' => 'pending']
        );

        if ($progress->status === 'pending' || $progress->status === 'locked') {
            $progress->update(['status' => 'in_progress']);
        }

        return Inertia::render('Peserta/Workshop/Play', [
            'auth' => ['user' => $user],
            'module' => $module,
            'progress' => $progress,
        ]);
    }

    // ✅ SUBMIT QUIZ - LOGIC PERBAIKAN: REDIRECT BACK (SPA)
    public function submitQuiz(Request $request, $id)
    {
        $request->validate([
            'type' => 'required|in:pre_test,post_test',
            'answers' => 'required|array'
        ]);

        $questions = ModuleQuestion::where('module_id', $id)
            ->where('type', $request->type)
            ->get();

        $totalQuestions = $questions->count();
        $correctCount = 0;

        // Hitung Skor
        foreach ($questions as $q) {
            if (isset($request->answers[$q->id]) && (int)$request->answers[$q->id] === (int)$q->correct_answer) {
                $correctCount++;
            }
        }

        $finalScore = $totalQuestions > 0 ? round(($correctCount / $totalQuestions) * 100) : 0;

        // Simpan Progress
        $progress = StudentModuleProgress::firstOrCreate(
            ['user_id' => Auth::id(), 'module_id' => $id],
            ['status' => 'in_progress']
        );

        // Update History Jawaban
        $currentHistory = $progress->history ?? []; 
        $currentHistory[$request->type] = $request->answers;

        if ($request->type === 'pre_test') {
            $progress->pretest_score = $finalScore;
        } else {
            $progress->posttest_score = $finalScore;
            if ($finalScore >= 70) $progress->status = 'completed';
        }

        $progress->history = $currentHistory; 
        $progress->save();

        // ⚠️ PERBAIKAN UTAMA DISINI: Gunakan 'back()' agar tidak error Page Not Found
        // Frontend (Play.tsx) akan menangani perubahan tampilan ke Result secara lokal (SPA)
        return redirect()->back()->with('success', 'Jawaban terkirim! Nilai Anda: ' . $finalScore);
    }

    // Halaman Show Result (Untuk Peserta, jika diakses manual/lewat dashboard)
    // Method ini tetap ada untuk fallback, tapi tidak dipanggil langsung oleh submitQuiz
    public function showResult($moduleId, $type)
    {
        $user = Auth::user();
        $dbType = strtolower(str_replace('-', '_', $type)); 

        $module = Module::findOrFail($moduleId);
        $progress = StudentModuleProgress::where('user_id', $user->id)
            ->where('module_id', $moduleId)
            ->firstOrFail();

        $questions = ModuleQuestion::where('module_id', $moduleId)
            ->where('type', $dbType)
            ->get();

        $userAnswers = $progress->history[$dbType] ?? [];
        $reviewData = [];
        $correctCount = 0;

        foreach ($questions as $q) {
            $userAnsIdx = $userAnswers[$q->id] ?? null;
            $isCorrect = (!is_null($userAnsIdx) && (int)$userAnsIdx === (int)$q->correct_answer);
            
            if ($isCorrect) $correctCount++;

            $options = $q->options;
            
            $userAnswerText = '-';
            if (!is_null($userAnsIdx) && isset($options[$userAnsIdx])) {
                $userAnswerText = $options[$userAnsIdx]['text'] ?: '(Gambar Opsi)';
            }

            $correctAnswerText = 'Error Key';
            if (isset($options[$q->correct_answer])) {
                $correctAnswerText = $options[$q->correct_answer]['text'] ?: '(Gambar Opsi)';
            }

            $reviewData[] = [
                'id' => $q->id,
                'question' => $q->question,
                'media_url' => $q->media_url,
                'user_answer_text' => $userAnswerText,
                'correct_answer_text' => $correctAnswerText,
                'is_correct' => $isCorrect
            ];
        }

        $score = $dbType === 'pre_test' ? $progress->pretest_score : $progress->posttest_score;

        return Inertia::render('Peserta/Modul/DetailResult', [
            'auth' => ['user' => $user],
            'module' => ['id' => $module->id, 'title' => $module->title],
            'score' => $score ?? 0,
            'total_questions' => $questions->count(),
            'correct_count' => $correctCount,
            'wrong_count' => $questions->count() - $correctCount,
            'review_data' => $reviewData,
            'type' => $type 
        ]);
    }

    public function submitPhoto(Request $request, $id)
    {
        $request->validate(['photo' => 'required|image|max:5120']);
        $progress = StudentModuleProgress::where('user_id', Auth::id())->where('module_id', $id)->firstOrFail();

        if ($request->hasFile('photo')) {
            if ($progress->photo_url) Storage::disk('public')->delete($progress->photo_url);
            $progress->photo_url = $request->file('photo')->store('submissions', 'public');
            $progress->save();
        }
        return redirect()->back()->with('success', 'Bukti praktik berhasil diunggah!');
    }

    // --- API HELPERS (Untuk Play.tsx) ---
    public function getSteps($id) { return response()->json(ModuleStep::where('module_id', $id)->get()); }
    public function getQuiz($id, $type) { return response()->json(ModuleQuestion::where('module_id', $id)->where('type', $type)->get()); }

    /**
     * Helper Basic (Untuk Tools & Steps Upload)
     */
    private function handleFileUpload($newFile, $existingUrl, $folder)
    {
        if ($newFile && $newFile instanceof \Illuminate\Http\UploadedFile) {
            return '/storage/' . $newFile->store($folder, 'public');
        }
        if ($existingUrl) {
            if (str_starts_with($existingUrl, 'blob:')) return null;
            return $existingUrl;
        }
        return null;
    }
}
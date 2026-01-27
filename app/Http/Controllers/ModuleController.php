<?php

namespace App\Http\Controllers;

use App\Models\Module;
use App\Models\ModuleStep;
use App\Models\ModuleQuestion;
use App\Models\StudentModuleProgress;
use App\Models\Setting;
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

    // ✅ UPDATE METHOD (FIXED & ROBUST)
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
                        'name' => $toolData['name'] ?? 'Alat Baru', // Fix undefined
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
                        'title' => $stepData['title'] ?? 'Langkah', // Fix undefined
                        'description' => $stepData['description'] ?? '',
                        'media_url' => $path,
                        'media_type' => $path ? $type : null,
                    ]);
                }
            }

            // 4. Handle Questions (Pre & Post Test) - FIX ARRAY KEY & FILE UPLOAD
            $module->questions()->delete();
            
            if ($request->questions && is_array($request->questions)) {
                // Gunakan $key untuk akses file nested secara akurat
                foreach ($request->questions as $key => $qData) {
                    
                    // A. Handle Media Soal Utama
                    $mainPath = null;
                    $mainType = null;

                    // Cek apakah ada file baru di request
                    if ($request->hasFile("questions.{$key}.media_file")) {
                        $file = $request->file("questions.{$key}.media_file");
                        $mainPath = '/storage/' . $file->store('module_questions', 'public');
                        $mime = $file->getMimeType();
                        $mainType = str_contains($mime, 'video') ? 'video' : 'image';
                    } else {
                        // Jika tidak ada file baru, gunakan URL lama (validasi blob)
                        $oldUrl = $qData['media_url'] ?? null;
                        if ($oldUrl && !str_starts_with($oldUrl, 'blob:')) {
                            $mainPath = $oldUrl;
                            $mainType = 'image'; 
                        }
                    }

                    // B. Handle Options & Media Options
                    $optionsText = [];
                    $optionsMedia = [];
                    $existingOptions = $qData['options'] ?? [];

                    // Loop 4 Opsi
                    for ($i = 0; $i < 4; $i++) {
                        $optPath = null;

                        // 1. Cek File Baru untuk Opsi ke-i
                        if ($request->hasFile("questions.{$key}.options_media_files.{$i}")) {
                            $file = $request->file("questions.{$key}.options_media_files.{$i}");
                            $optPath = '/storage/' . $file->store('module_options', 'public');
                        } 
                        // 2. Jika tidak, Cek URL Lama
                        else if (isset($existingOptions[$i]['media_url'])) {
                            $oldOptUrl = $existingOptions[$i]['media_url'];
                            if ($oldOptUrl && !str_starts_with($oldOptUrl, 'blob:')) {
                                $optPath = $oldOptUrl;
                            }
                        }

                        $optionsMedia[$i] = $optPath;

                        // Reconstruct JSON Object untuk Opsi
                        $optionsText[] = [
                            'text' => $existingOptions[$i]['text'] ?? '',
                            'media_url' => $optPath
                        ];
                    }

                    // C. Simpan ke Database
                    $module->questions()->create([
                        // Gunakan ?? Default Value untuk mencegah error Undefined Index
                        'type' => $qData['type'] ?? 'pre_test',
                        'question' => $qData['question'] ?? 'Pertanyaan...',
                        'options' => $optionsText, // JSON
                        'correct_answer' => $qData['correct_answer'] ?? 0,
                        'media_url' => $mainPath,
                        'media_type' => $mainPath ? $mainType : null,
                        'options_media' => $optionsMedia, // Backup
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

    public function getSteps($id) { return response()->json(ModuleStep::where('module_id', $id)->get()); }
    public function getQuiz($id, $type) { return response()->json(ModuleQuestion::where('module_id', $id)->where('type', $type)->get()); }

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

        foreach ($questions as $q) {
            if (isset($request->answers[$q->id]) && (int)$request->answers[$q->id] === (int)$q->correct_answer) {
                $correctCount++;
            }
        }

        $finalScore = $totalQuestions > 0 ? round(($correctCount / $totalQuestions) * 100) : 0;

        $progress = StudentModuleProgress::firstOrCreate(
            ['user_id' => Auth::id(), 'module_id' => $id],
            ['status' => 'in_progress']
        );

        if ($request->type === 'pre_test') {
            $progress->pretest_score = $finalScore;
        } else {
            $progress->posttest_score = $finalScore;
            if ($finalScore >= 70) $progress->status = 'completed';
        }

        $progress->save();
        return redirect()->back()->with('success', 'Jawaban terkirim! Nilai Anda: ' . $finalScore);
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

    /**
     * Helper Basic (Untuk Tools & Steps)
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
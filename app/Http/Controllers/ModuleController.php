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

        // Ambil Data Setting Global Soft Skills
        $rawSoftSkills = Setting::where('key', 'global_soft_skills')->value('value');
        $globalSoftSkills = $rawSoftSkills ? json_decode($rawSoftSkills) : ['Kedisiplinan', 'Kerapian'];

        return Inertia::render('Pengajar/Modul/Index', [ // Sesuaikan path jika file index dipindah
            'modules' => $modules,
            'globalSoftSkills' => $globalSoftSkills
        ]);
    }

    // Update Kriteria Global Soft Skills
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
    $module = Module::with(['pre_test_questions', 'post_test_questions'])->findOrFail($id);

    // Arahkan ke folder Pages/Pengajar/Modul/Edit
    return Inertia::render('Pengajar/Modul/Edit', [
        'module' => $module
    ]);
}

    public function update(Request $request, $id)
    {
        DB::transaction(function () use ($request, $id) {
            $module = Module::findOrFail($id);

            // 1. Update Info Dasar
            $module->update([
                'title' => $request->title,
                'description' => $request->description,
            ]);

            // 2. Handle Steps
            $module->steps()->delete(); 
            if ($request->steps) {
                foreach ($request->steps as $stepData) {
                    $path = $this->handleFileUpload($stepData['media_file'] ?? null, $stepData['media_url'] ?? null, 'module_steps');
                    $type = $stepData['media_type'] ?? 'image';
                    if (isset($stepData['media_file']) && $stepData['media_file'] instanceof \Illuminate\Http\UploadedFile) {
                        $mime = $stepData['media_file']->getMimeType();
                        $type = str_contains($mime, 'video') ? 'video' : 'image';
                    }

                    $module->steps()->create([
                        'title' => $stepData['title'],
                        'description' => $stepData['description'],
                        'media_url' => $path,
                        'media_type' => $path ? $type : null,
                    ]);
                }
            }

            // 3. Handle Questions
            $module->questions()->delete();
            if ($request->questions) {
                foreach ($request->questions as $qData) {
                    $mainPath = $this->handleFileUpload($qData['media_file'] ?? null, $qData['media_url'] ?? null, 'module_questions');
                    $mainType = $qData['media_type'] ?? null;
                    if (isset($qData['media_file']) && $qData['media_file'] instanceof \Illuminate\Http\UploadedFile) {
                        $mime = $qData['media_file']->getMimeType();
                        $mainType = str_contains($mime, 'video') ? 'video' : 'image';
                    }

                    $optionsMedia = [];
                    $files = $qData['options_media_files'] ?? [null, null, null, null];
                    $existingUrls = $qData['options_media'] ?? [null, null, null, null];

                    for ($i = 0; $i < 4; $i++) {
                        $oldUrl = null;
                        if (isset($existingUrls[$i]) && is_array($existingUrls[$i]) && isset($existingUrls[$i]['url'])) {
                            $oldUrl = $existingUrls[$i]['url'];
                        }
                        $optPath = $this->handleFileUpload($files[$i] ?? null, $oldUrl, 'module_options');
                        if ($optPath) {
                            $optionsMedia[$i] = ['url' => $optPath, 'type' => 'image']; 
                        } else {
                            $optionsMedia[$i] = null;
                        }
                    }

                    $module->questions()->create([
                        'type' => $qData['type'],
                        'question' => $qData['question'],
                        'options' => $qData['options'],
                        'correct_answer' => $qData['correct_answer'],
                        'media_url' => $mainPath,
                        'media_type' => $mainPath ? $mainType : null,
                        'options_media' => $optionsMedia,
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

    // ✅ UPDATE: Mengarah ke Page Preview Pengajar yang baru
    public function preview($id)
    {
        $module = Module::with(['steps', 'questions'])->findOrFail($id);
        
        return Inertia::render('Pengajar/Modul/Preview', [ // Path file React: Pengajar/Modul/Preview.tsx
            'module' => $module,
            // Tidak perlu kirim progress karena ini preview murni
        ]);
    }

    // =======================================================================
    // 2. AREA PESERTA (STUDENT) & API
    // =======================================================================

    // ✅ UPDATE: Mengarah ke Page Play Peserta yang baru
    public function play($id)
    {
        $user = Auth::user();
        $module = Module::with(['steps', 'questions'])->findOrFail($id);
        
        $progress = StudentModuleProgress::firstOrCreate(
            ['user_id' => $user->id, 'module_id' => $module->id],
            ['status' => 'pending']
        );

        if ($progress->status === 'pending' || $progress->status === 'locked') {
            $progress->update(['status' => 'in_progress']);
        }

        return Inertia::render('Peserta/Workshop/Play', [ // Path file React: Peserta/Workshop/Play.tsx
            'auth' => ['user' => $user],
            'module' => $module,
            'progress' => $progress,
        ]);
    }

    public function getSteps($id) { return response()->json(ModuleStep::where('module_id', $id)->get()); }
    public function getQuiz($id, $type) { return response()->json(ModuleQuestion::where('module_id', $id)->where('type', $type)->get()); }

    // ✅ UPDATE: Menghitung skor di Backend berdasarkan jawaban yang dikirim
    public function submitQuiz(Request $request, $id)
    {
        $request->validate([
            'type' => 'required|in:pre_test,post_test',
            'answers' => 'required|array' // Terima array jawaban: {question_id: answer_index}
        ]);

        // 1. Ambil Kunci Jawaban dari Database
        $questions = ModuleQuestion::where('module_id', $id)
                    ->where('type', $request->type)
                    ->get();

        $totalQuestions = $questions->count();
        $correctCount = 0;

        // 2. Hitung Nilai
        foreach ($questions as $q) {
            // Cek apakah jawaban user ada dan sesuai kunci (index)
            if (isset($request->answers[$q->id]) && 
                (int)$request->answers[$q->id] === (int)$q->correct_answer) {
                $correctCount++;
            }
        }

        // Skor 0-100
        $finalScore = $totalQuestions > 0 ? round(($correctCount / $totalQuestions) * 100) : 0;

        // 3. Simpan Progress
        $progress = StudentModuleProgress::firstOrCreate(
            ['user_id' => Auth::id(), 'module_id' => $id], 
            ['status' => 'in_progress']
        );

        if ($request->type === 'pre_test') {
            $progress->pretest_score = $finalScore;
        } else {
            $progress->posttest_score = $finalScore;
            // Syarat lulus: Skor >= 70
            if ($finalScore >= 70) {
                $progress->status = 'completed';
            }
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

    private function handleFileUpload($newFile, $oldUrl, $folder)
    {
        if ($newFile && $newFile instanceof \Illuminate\Http\UploadedFile) {
            return '/storage/' . $newFile->store($folder, 'public'); 
        }
        return (is_string($oldUrl)) ? $oldUrl : null;
    }
}
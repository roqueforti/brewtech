<?php

namespace App\Http\Controllers;

use App\Models\Module;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class ModuleController extends Controller
{
    public function index()
    {
        // Load relasi steps dan questions agar bisa diedit di frontend
        $modules = Module::with(['steps', 'questions'])->latest()->get();
        
        return Inertia::render('Pengajar/ManajemenModul', [
            'modules' => $modules
        ]);
    }

    public function store(Request $request)
    {
        // Validasi dasar
        $validated = $request->validate([
            'title' => 'required|string',
            'description' => 'required',
            'category' => 'required',
            'duration' => 'required',
            // Validasi Nested (Array) - Opsional saat create awal
            'steps' => 'array|nullable',
            'questions' => 'array|nullable',
        ]);

        // Gunakan variabel $module untuk menampung hasil create dari dalam transaction
        $module = DB::transaction(function () use ($validated) {
            // 1. Simpan Modul Utama
            $newModule = Module::create([
                'title' => $validated['title'],
                'description' => $validated['description'],
                'category' => $validated['category'],
                'duration' => $validated['duration'],
            ]);

            // 2. Simpan Langkah Praktikum (Jika ada input awal)
            if (!empty($validated['steps'])) {
                foreach ($validated['steps'] as $index => $step) {
                    $newModule->steps()->create([
                        'order' => $index + 1,
                        'title' => $step['title'],
                        'description' => $step['description']
                    ]);
                }
            }

            // 3. Simpan Soal (Jika ada input awal)
            if (!empty($validated['questions'])) {
                foreach ($validated['questions'] as $q) {
                    $newModule->questions()->create([
                        'type' => $q['type'],
                        'question' => $q['question'],
                        'options' => $q['options'], 
                        'correct_answer' => $q['correct_answer']
                    ]);
                }
            }

            return $newModule; // Kembalikan object modul
        });

        // ✅ PERUBAHAN PENTING:
        // Redirect langsung ke halaman Detail/Edit agar user bisa lanjut isi materi
        return redirect()->route('pengajar.modul.edit', $module->id)
                         ->with('success', 'Modul dibuat! Silakan lengkapi materi.');
    }

public function edit($id) {
    $module = Module::with(['steps', 'questions'])->findOrFail($id);
    return Inertia::render('Pengajar/DetailModul', ['module' => $module]);
}

    public function update(Request $request, $id)
    {
        $module = Module::findOrFail($id);
        
        $validated = $request->validate([
            'title' => 'required',
            'description' => 'required',
            'category' => 'required',
            'duration' => 'required',
            'steps' => 'array|nullable',
            'questions' => 'array|nullable',
        ]);

        DB::transaction(function () use ($module, $validated, $request) {
            // 1. Update Modul Utama
            $module->update([
                'title' => $validated['title'],
                'description' => $validated['description'],
                'category' => $validated['category'],
                'duration' => $validated['duration'],
            ]);

            // --- HELPER UPLOAD ---
            // $fileInput: File object dari request
            // $oldData: Data {url, type} yang lama (dari DB)
            $processFile = function($fileInput, $oldData, $folder) {
                if ($fileInput instanceof \Illuminate\Http\UploadedFile) {
                    $path = $fileInput->store($folder, 'public');
                    return [
                        'url' => '/storage/' . $path,
                        'type' => str_contains($fileInput->getMimeType(), 'video') ? 'video' : 'image'
                    ];
                }
                // Jika tidak ada file baru, kembalikan data lama
                return $oldData ?? null; 
            };

            // 2. Update Steps
            $module->steps()->delete();
            if (!empty($request->steps)) {
                foreach ($request->steps as $index => $step) {
                    // Cek media utama step
                    $media = $processFile($step['media_file'] ?? null, [
                        'url' => $step['media_url'] ?? null, 
                        'type' => $step['media_type'] ?? null
                    ], 'media_steps');

                    $module->steps()->create([
                        'order' => $index + 1,
                        'title' => $step['title'],
                        'description' => $step['description'],
                        'media_url' => $media['url'] ?? null,
                        'media_type' => $media['type'] ?? null,
                    ]);
                }
            }

            // 3. Update Questions
            $module->questions()->delete();
            if (!empty($request->questions)) {
                foreach ($request->questions as $q) {
                    // Cek media utama soal
                    $qMedia = $processFile($q['media_file'] ?? null, [
                        'url' => $q['media_url'] ?? null,
                        'type' => $q['media_type'] ?? null
                    ], 'media_questions');

                    // Cek media untuk Opsi Jawaban (Loop 4 opsi)
                    $optionsMedia = [];
                    // Ambil data lama jika ada
                    $oldOptionsMedia = $q['options_media'] ?? [null, null, null, null]; 
                    
                    for ($i = 0; $i < 4; $i++) {
                        $fileInput = $q['options_media_files'][$i] ?? null;
                        $oldData = $oldOptionsMedia[$i] ?? null;
                        
                        $optionsMedia[$i] = $processFile($fileInput, $oldData, 'media_options');
                    }

                    $module->questions()->create([
                        'type' => $q['type'],
                        'question' => $q['question'],
                        'options' => $q['options'],
                        'correct_answer' => $q['correct_answer'],
                        'media_url' => $qMedia['url'] ?? null,
                        'media_type' => $qMedia['type'] ?? null,
                        'options_media' => $optionsMedia, // Simpan array media opsi
                    ]);
                }
            }
        });

        return redirect()->back()->with('success', 'Modul berhasil diperbarui!');
    }

    public function destroy($id)
    {
        Module::findOrFail($id)->delete();
        // Redirect ke index jika dihapus dari halaman detail
        return redirect()->route('pengajar.modul.index')->with('success', 'Modul dihapus!');
    }

public function preview($id) {
    $module = Module::with(['steps', 'questions'])->findOrFail($id);
    return Inertia::render('Peserta/WorkshopPlay', [ // Pastikan 'Peserta/' sesuai nama folder
        'module' => $module,
        'isPreview' => true
    ]);
}
}
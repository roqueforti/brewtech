<?php

namespace App\Http\Controllers;

use App\Models\Workshop;
use App\Models\StudentWorkshopProgress;
use App\Models\Question;
use App\Models\PraktikumStep;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class WorkshopController extends Controller
{
    // Halaman Utama Workshop Player
    public function show($id)
    {
        $user = Auth::user();
        $workshop = Workshop::findOrFail($id);
        
        // Ambil atau Buat Progress Siswa
        $progress = StudentWorkshopProgress::firstOrCreate(
            ['user_id' => $user->id, 'workshop_id' => $id],
            ['status' => 'in_progress']
        );

        // Tentukan "State" saat ini (User sedang di tahap mana?)
        $currentState = 'INTRO';
        if ($progress->pretest_score !== null) $currentState = 'PRAKTIKUM';
        if ($progress->praktikum_completed) $currentState = 'POSTTEST';
        if ($progress->posttest_score !== null) $currentState = 'PHOTO';
        if ($progress->photo_submission_url !== null) $currentState = 'COMPLETED';

        return Inertia::render('Peserta/WorkshopFlow', [
            'workshop' => $workshop,
            'progress' => $progress,
            'initialState' => $currentState
        ]);
    }

    // Ambil Data Langkah-Langkah Praktikum
    public function getSteps($id)
    {
        return PraktikumStep::where('workshop_id', $id)->orderBy('step_order')->get();
    }

    // Ambil Soal Kuis (Pretest / Posttest)
    public function getQuiz($id, $type)
    {
        // Security: Cek jika user mencoba akses pretest padahal sudah selesai
        $user = Auth::user();
        $progress = StudentWorkshopProgress::where('user_id', $user->id)
                    ->where('workshop_id', $id)->first();

        if ($type == 'pretest' && $progress->pretest_score !== null) {
             return response()->json(['error' => 'Pre-test sudah dikerjakan!'], 403);
        }

        return Question::where('workshop_id', $id)->where('type', $type)->get()->map(function($q) {
            // Sembunyikan kunci jawaban dari frontend!
            return [
                'id' => $q->id,
                'question_text' => $q->question_text,
                'options' => $q->options,
                'type' => $q->type
            ];
        });
    }

    // Submit Jawaban Kuis
    public function submitQuiz(Request $request, $id)
    {
        $answers = $request->answers; // Array [question_id => 'A', ...]
        $type = $request->type; // 'pretest' atau 'posttest'
        
        $score = 0;
        $total = count($answers);
        
        // Hitung Skor
        foreach ($answers as $qId => $ans) {
            $question = Question::find($qId);
            if ($question && $question->correct_answer == $ans) {
                $score++;
            }
        }
        
        $finalScore = ($total > 0) ? round(($score / $total) * 100) : 0;

        // Simpan ke Database
        $progress = StudentWorkshopProgress::where('user_id', Auth::id())
                    ->where('workshop_id', $id)->first();

        if ($type == 'pretest') {
            $progress->update(['pretest_score' => $finalScore]);
        } else {
            $progress->update(['posttest_score' => $finalScore]);
        }

        return response()->json(['score' => $finalScore]);
    }

    // Tandai Praktikum Selesai
    public function completePraktikum($id)
    {
        StudentWorkshopProgress::where('user_id', Auth::id())
            ->where('workshop_id', $id)
            ->update(['praktikum_completed' => true]);
            
        return response()->json(['success' => true]);
    }

    // Upload Foto Hasil Akhir
    public function submitPhoto(Request $request, $id)
    {
        $request->validate(['photo' => 'required|image|max:5000']); // Max 5MB

        $path = $request->file('photo')->store('submissions', 'public');

        StudentWorkshopProgress::where('user_id', Auth::id())
            ->where('workshop_id', $id)
            ->update([
                'photo_submission_url' => $path,
                'photo_submitted_at' => now(),
                'status' => 'completed' // Tandai workshop selesai total
            ]);

        return redirect()->back();
    }
}
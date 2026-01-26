<?php

namespace App\Http\Controllers\Pengajar;

use App\Http\Controllers\Controller;
use App\Models\Kelas;
use App\Models\Module;
use App\Models\User;
use App\Models\StudentModuleProgress;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class KelasController extends Controller
{
    /**
     * Halaman Detail Kelas (Utama)
     */
    public function show($id)
    {
        // 1. Ambil Data Kelas beserta Relasinya
        $kelas = Kelas::with([
            'students', 
            'modules' => function($q) {
                // Ambil data pivot (jadwal & status aktif)
                $q->withPivot('opens_at', 'is_active');
            }
        ])->withCount(['students', 'modules'])->findOrFail($id);

        // 2. Ambil Progress Belajar Semua Siswa di Kelas Ini
        // Agar guru bisa memantau siapa yang sudah mengerjakan modul apa
        $kelasProgress = StudentModuleProgress::whereIn('user_id', $kelas->students->pluck('id'))
            ->join('users', 'student_module_progress.user_id', '=', 'users.id')
            ->select('student_module_progress.*', 'users.name as student_name', 'users.id as student_id')
            ->get();

        // 3. Data untuk Dropdown "Tambah Modul" (Modul yang belum ada di kelas ini)
        $existingModuleIds = $kelas->modules->pluck('id');
        $availableModules = Module::whereNotIn('id', $existingModuleIds)->get();

        // 4. Data untuk Dropdown "Tambah Siswa" (Siswa yang belum punya kelas)
        $availableStudents = User::where('role', 'student')
            ->whereNull('kelas_id')
            ->get();

        return Inertia::render('Pengajar/DetailKelas', [
            'kelas' => $kelas,
            'kelasProgress' => $kelasProgress,
            'availableModules' => $availableModules,
            'availableStudents' => $availableStudents,
        ]);
    }

    /**
     * Update Jadwal & Status Modul (Fitur Dinamis)
     */
    public function updateModuleSchedule(Request $request, $kelasId, $moduleId)
    {
        $request->validate([
            'is_active' => 'required|boolean',
            'opens_at' => 'nullable|date', // Bisa null jika langsung buka
        ]);

        $kelas = Kelas::findOrFail($kelasId);

        // Update data di tabel pivot (class_module)
        $kelas->modules()->updateExistingPivot($moduleId, [
            'is_active' => $request->is_active,
            'opens_at' => $request->opens_at,
        ]);

        return redirect()->back()->with('success', 'Jadwal modul berhasil diperbarui.');
    }

    /**
     * Tambahkan Modul ke Kelas
     */
    public function addModule(Request $request, $kelasId)
    {
        $request->validate(['module_id' => 'required|exists:modules,id']);
        
        $kelas = Kelas::findOrFail($kelasId);
        
        // Attach dengan default: Non-Aktif dulu (biar guru yang aktifkan)
        $kelas->modules()->attach($request->module_id, [
            'is_active' => false,
            'opens_at' => null
        ]);

        return redirect()->back()->with('success', 'Modul berhasil ditambahkan ke kelas.');
    }

    /**
     * Hapus Modul dari Kelas
     */
    public function removeModule($kelasId, $moduleId)
    {
        $kelas = Kelas::findOrFail($kelasId);
        $kelas->modules()->detach($moduleId);

        return redirect()->back()->with('success', 'Modul dihapus dari kurikulum kelas.');
    }

    /**
     * Masukkan Siswa ke Kelas
     */
    public function addStudent(Request $request, $kelasId)
    {
        $request->validate(['student_id' => 'required|exists:users,id']);

        $student = User::findOrFail($request->student_id);
        $student->update(['kelas_id' => $kelasId]);

        return redirect()->back()->with('success', 'Siswa berhasil dimasukkan ke kelas.');
    }

    /**
     * Keluarkan Siswa dari Kelas
     */
    public function removeStudent($kelasId, $studentId)
    {
        $student = User::where('id', $studentId)->where('kelas_id', $kelasId)->firstOrFail();
        $student->update(['kelas_id' => null]); // Set jadi null (tanpa kelas)

        return redirect()->back()->with('success', 'Siswa dikeluarkan dari kelas.');
    }
}
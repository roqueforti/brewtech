<?php

namespace App\Http\Controllers;

use App\Models\Kelas; // ✅ Pakai Model 'Kelas'
use App\Models\Module;
use Illuminate\Http\Request;
use Inertia\Inertia;

class WorkshopController extends Controller
{
    public function index()
{
    // ❌ SALAH: 'workshops' tidak ada di model Kelas
    // $dataKelas = Kelas::withCount(['students', 'workshops']) 

    // ✅ BENAR: Gunakan 'modules' sesuai nama fungsi di Model Kelas
    $dataKelas = Kelas::withCount(['students', 'modules'])
        ->latest()
        ->get();

    return Inertia::render('Pengajar/ManajemenKelas', [
        'classrooms' => $dataKelas
    ]);
}

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        Kelas::create([
            'name' => $validated['name'],
            'description' => $validated['description'],
        ]);

        return redirect()->back()->with('success', 'Kelas berhasil dibuat!');
    }

    public function destroy($id)
    {
        $kelas = Kelas::findOrFail($id);
        $kelas->delete();

        return redirect()->back()->with('success', 'Kelas berhasil dihapus.');
    }

    public function show($id)
{
    // ✅ Panggil 'modules', JANGAN 'workshops'
    $kelas = Kelas::with(['modules' => function($query) {
        $query->orderBy('kelas_module.order', 'asc');
    }])->findOrFail($id);
    
    // ✅ Panggil 'kelas', JANGAN 'workshops'
    $availableModules = Module::whereDoesntHave('kelas', function($q) use ($id) {
        $q->where('kelas_id', $id);
    })->get();

    return Inertia::render('Pengajar/DetailKelas', [
        'classroom' => $kelas,
        'availableModules' => $availableModules
    ]);
}

    public function addModule(Request $request, $id)
    {
        $kelas = Kelas::findOrFail($id);
        
        // Cek duplikasi di tabel pivot
        if (!$kelas->modules()->where('module_id', $request->module_id)->exists()) {
            $kelas->modules()->attach($request->module_id);
        }

        return redirect()->back()->with('success', 'Modul berhasil ditambahkan.');
    }

    public function removeModule($kelasId, $moduleId)
    {
        $kelas = Kelas::findOrFail($kelasId);
        $kelas->modules()->detach($moduleId);

        return redirect()->back()->with('success', 'Modul dihapus dari kurikulum.');
    }
}
<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Kelas;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class StudentAuthController extends Controller
{
    /**
     * Menampilkan Halaman Login Khusus Siswa (Kiosk Mode).
     */
    public function showLoginForm()
    {
        // 1. Ambil data Kelas beserta Siswanya (Eager Loading)
        $kelasData = Kelas::with(['students' => function ($query) {
            $query->where('role', 'student')
                  // ✅ UPDATE: Tambahkan 'school_grade' dan 'disability' ke dalam select
                  // Agar data ini tersedia di Frontend Login jika ingin ditampilkan
                  ->select('id', 'name', 'kelas_id', 'school_grade', 'disability') 
                  ->orderBy('name', 'asc');
        }])->get();

        return Inertia::render('Auth/Login', [
            'kelasFromDB' => $kelasData
        ]);
    }

    /**
     * Memproses Login Siswa tanpa Password (berdasarkan ID).
     */
    public function login(Request $request)
    {
        // 1. Validasi Input dari React
        $request->validate([
            'kelas_id' => 'required|exists:kelas,id',
            'user_id'  => 'required|exists:users,id',
        ]);

        // 2. Cari User di Database
        // Pastikan user tersebut benar-benar murid di kelas yang dipilih (Security Check)
        $user = User::where('id', $request->user_id)
                    ->where('kelas_id', $request->kelas_id)
                    ->where('role', 'student')
                    ->first();

        // 3. Proses Login
        if ($user) {
            Auth::login($user);
            $request->session()->regenerate();

            // Redirect ke Dashboard Peserta
            return redirect()->intended(route('peserta.dashboard'));
        }

        // 4. Jika gagal
        return back()->withErrors([
            'login_error' => 'Data siswa tidak valid atau tidak ditemukan.',
        ]);
    }
}
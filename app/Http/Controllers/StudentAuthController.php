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
     * Mengambil data Kelas & Siswa dari Database untuk dirender di React.
     */
    public function showLoginForm()
    {
        // 1. Ambil data Kelas beserta Siswanya (Eager Loading)
        // Kita filter hanya user yang role-nya 'student' agar admin/pengajar tidak muncul di list
        $kelasData = Kelas::with(['students' => function ($query) {
            $query->where('role', 'student')
                  ->select('id', 'name', 'kelas_id') // Ambil kolom yang perlu saja biar ringan
                  ->orderBy('name', 'asc');
        }])->get();

        // 2. Kirim data ke Frontend (Login.tsx) via Inertia
        // Data ini akan diterima sebagai props bernama 'kelasFromDB'
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
            // Login user secara manual (Laravel Auth)
            Auth::login($user);

            // Regenerasi session ID untuk keamanan
            $request->session()->regenerate();

            // Redirect ke Dashboard Peserta
            return redirect()->intended(route('dashboard.peserta'));
        }

        // 4. Jika gagal (misal user tidak ditemukan atau manipulasi data)
        return back()->withErrors([
            'login_error' => 'Data siswa tidak valid atau tidak ditemukan.',
        ]);
    }
}
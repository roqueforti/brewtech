<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SettingController extends Controller
{
    public function index()
    {
        // Ambil semua setting dan format menjadi key-value array agar mudah dipakai di React
        $settings = Setting::all()->pluck('value', 'key');

        return Inertia::render('Pengajar/Pengaturan', [
            'settings' => $settings
        ]);
    }

    public function update(Request $request)
    {
        // Validasi total bobot harus 100%
        $visual = $request->input('spk_bobot_visual');
        $soft = $request->input('spk_bobot_soft');
        
        if (($visual + $soft) != 100) {
            return redirect()->back()->withErrors(['bobot' => 'Total bobot Visual + Soft Skill harus 100%.']);
        }

        // Simpan semua input ke database
        foreach ($request->all() as $key => $value) {
            Setting::updateOrCreate(
                ['key' => $key],
                ['value' => $value]
            );
        }

        return redirect()->back()->with('success', 'Pengaturan sistem berhasil diperbarui!');
    }
}
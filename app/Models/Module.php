<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Module extends Model
{
    protected $guarded = []; 

    protected $casts = [
        'soft_skill_config' => 'array',
    ];

    // Relasi ke Steps
    public function steps(): HasMany
    {
        return $this->hasMany(ModuleStep::class);
    }

    // Relasi ke SEMUA pertanyaan (Gabungan)
    public function questions(): HasMany
    {
        return $this->hasMany(ModuleQuestion::class);
    }

    // ✅ TAMBAHKAN INI: Relasi Khusus Pre-Test
    // Mengambil data dari tabel module_questions dimana kolom type = 'pre_test'
// ✅ RELASI KHUSUS PRE-TEST (Penting!)
    public function pre_test_questions()
    {
        return $this->hasMany(ModuleQuestion::class)->where('type', 'pre_test');
    }

    // ✅ RELASI KHUSUS POST-TEST (Penting!)
    public function post_test_questions()
    {
        return $this->hasMany(ModuleQuestion::class)->where('type', 'post_test');
    }

    // Relasi ke Kelas
    public function kelas() {
        return $this->belongsToMany(Kelas::class, 'kelas_module', 'module_id', 'kelas_id');
    }

    public function tools()
{
    return $this->hasMany(ModuleTool::class);
}
}
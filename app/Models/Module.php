<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Module extends Model
{
    use HasFactory;

    protected $guarded = [];

    // ❌ HAPUS atau GANTI function workshops()
    // public function workshops() { ... }

    // ✅ GANTI JADI INI:
    public function kelas()
    {
        // Pastikan parameter ke-2 adalah nama tabel pivot yang baru: 'kelas_module'
        return $this->belongsToMany(Kelas::class, 'kelas_module')
                    ->withPivot('order')
                    ->withTimestamps();
    }

    public function steps()
    {
        return $this->hasMany(ModuleStep::class)->orderBy('order');
    }

    public function questions()
    {
        return $this->hasMany(ModuleQuestion::class);
    }
}
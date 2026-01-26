<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Kelas extends Model
{
    protected $table = 'kelas'; // Explicit table name
    protected $guarded = [];

    // Relasi ke Module
    public function modules() {
        return $this->belongsToMany(Module::class, 'kelas_module', 'kelas_id', 'module_id')
                    ->withPivot(['opens_at', 'is_active']) // ✅ Akses kolom tambahan
                    ->withTimestamps();
    }
    
    // Relasi ke Siswa
    public function students()
    {
        return $this->hasMany(User::class, 'kelas_id');
    }
}
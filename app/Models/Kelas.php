<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Kelas extends Model
{
    use HasFactory;

    protected $table = 'kelas';
    protected $guarded = ['id'];

    // ✅ GANTI JADI HAS MANY (Satu Kelas punya Banyak Siswa)
    // Laravel tidak akan mencari tabel 'kelas_user' lagi, tapi mencari kolom 'kelas_id' di tabel 'users'
    public function students()
    {
        return $this->hasMany(User::class, 'kelas_id')->where('role', 'student');
    }

    // Relasi ke Kurikulum (Tetap Many-to-Many)
    public function modules()
    {
        return $this->belongsToMany(Module::class, 'kelas_module')
                    ->withPivot('order')
                    ->withTimestamps();
    }
}
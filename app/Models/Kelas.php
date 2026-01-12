<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Kelas extends Model
{
    use HasFactory;
    
    protected $table = 'kelas'; 
    protected $fillable = ['nama', 'emoji', 'pelatih', 'periode', 'deskripsi', 'theme', 'status'];

    // 👇 FUNGSI INI WAJIB ADA (KARENADIPANGGIL DI CONTROLLER)
    public function students()
    {
        // Menghubungkan Kelas ke User (role student)
        return $this->hasMany(User::class, 'kelas_id')->where('role', 'student');
    }

    public function workshops()
    {
        // Menghubungkan Kelas ke Workshop
        return $this->hasMany(Workshop::class, 'kelas_id');
    }
}
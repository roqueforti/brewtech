<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    // ✅ Gunakan guarded kosong agar semua kolom bisa diisi seeder
    protected $guarded = []; 

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];
    
    // Relasi ke Kelas
    public function kelas() {
        return $this->belongsTo(Kelas::class, 'kelas_id');
    }

    // Relasi ke Progress
    public function progress() {
        return $this->hasMany(StudentModuleProgress::class);
    }

    public function spkResult() {
        // Satu siswa punya satu hasil SPK
        return $this->hasOne(StudentSpkResult::class, 'user_id');
     }
}
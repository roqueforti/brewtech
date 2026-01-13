<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role', // pastikan ada kolom role (admin/student/instructor)
        'kelas_id', // TAMBAHAN
        'pre_test_score', // TAMBAHAN
        'post_test_score', // TAMBAHAN
        'status_pkl', // TAMBAHAN
        'phone',
    'age',
    'school_grade',
    'disability',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    // Relasi: User (Siswa) milik satu Kelas
 public function kelas(): BelongsTo
    {
        return $this->belongsTo(Kelas::class, 'kelas_id');
    }

    // Helper untuk cek role (Opsional tapi berguna)
    public function hasRole(string $role): bool
    {
        return $this->role === $role;
    }

    // 2. Relasi ke Progress Workshop (User punya banyak Progress)
    public function workshopProgress()
    {
        return $this->hasMany(StudentWorkshopProgress::class, 'user_id');
    }

    // 3. Relasi ke Hasil SPK (User punya 1 Hasil SPK)
    public function spkResult()
    {
        return $this->hasOne(StudentSpkResult::class, 'user_id');
    }

    public function workshops()
{
    return $this->belongsToMany(Workshop::class, 'student_workshops')
                ->withPivot('status', 'score', 'completed_at', 'updated_at')
                ->withTimestamps();
}

// Relasi ke Riwayat Aktivitas
public function activities()
{
    return $this->hasMany(StudentActivity::class)->latest();
}
}
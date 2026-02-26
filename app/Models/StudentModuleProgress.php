<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StudentModuleProgress extends Model
{
    use HasFactory;

    protected $table = 'student_module_progress'; 

    // ✅ PENTING: Gunakan $guarded = ['id'] daripada $fillable.
    // Ini mengizinkan semua kolom (seperti 'history', 'trainer_notes', dll) untuk diisi,
    // kecuali kolom 'id'. Ini mencegah error "Mass Assignment" jika ada kolom baru.
    protected $guarded = ['id'];

    // ✅ CASTING OTOMATIS
    protected $casts = [
        'history' => 'array',              // ⚠️ WAJIB: Agar History Quiz terbaca sebagai JSON Object di React
        'trainer_soft_details' => 'array', // Penilaian Instruktur
        'teacher_soft_details' => 'array', // Penilaian Guru
        'soft_skill_details' => 'array',   // (Legacy/Cadangan)
        'is_completed' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function module()
    {
        return $this->belongsTo(Module::class);
    }
}
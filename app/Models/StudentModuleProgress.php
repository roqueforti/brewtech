<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StudentModuleProgress extends Model
{
    use HasFactory;

    protected $table = 'student_module_progress'; 

    protected $fillable = [
        'user_id',
        'module_id',
        'status',
        'pretest_score',
        'posttest_score',
        'photo_url',
        'praktikum_completed',
        'soft_skill_score',   // Nilai Rata-rata
        'soft_skill_details', // ✅ Detail Nilai per Kriteria (JSON)
        'soft_skill_notes'    // Catatan
    ];

    // ✅ FITUR BARU: Casting otomatis JSON ke Array
    protected $casts = [
        'soft_skill_details' => 'array',
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
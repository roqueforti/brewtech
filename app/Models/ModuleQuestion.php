<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ModuleQuestion extends Model
{
    use HasFactory;

    // ✅ Menggunakan fillable agar lebih aman & spesifik
    protected $fillable = [
        'module_id',
        'type',           // 'pre_test' atau 'post_test'
        'question',
        'options',        // Disimpan otomatis sebagai JSON/Array
        'correct_answer', // Index jawaban benar (0-3)
        'media_url',
        'media_type',     // 'image' atau 'video'
        'options_media',  // Array URL media opsi
    ];

    // ✅ Casting otomatis JSON <-> Array (Sangat Penting!)
    protected $casts = [
        'options' => 'array',
        'options_media' => 'array',
    ];

    public function module()
    {
        return $this->belongsTo(Module::class);
    }
}
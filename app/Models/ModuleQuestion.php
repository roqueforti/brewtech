<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ModuleQuestion extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    // ✅ BAGIAN PENTING: CASTING JSON
    protected $casts = [
        'options' => 'array',       // Mengubah JSON DB <-> Array PHP
        'options_media' => 'array', // ✅ Tambahkan ini agar tidak error "Array to string"
    ];

    public function module()
    {
        return $this->belongsTo(Module::class);
    }
}
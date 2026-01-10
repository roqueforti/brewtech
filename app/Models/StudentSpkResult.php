<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StudentSpkResult extends Model
{
    use HasFactory;

    // Izinkan semua kolom diisi (mass assignment)
    protected $guarded = [];

    // PENTING: Casting JSON ke Array
    // Agar saat diambil dari DB, otomatis jadi Array PHP, bukan string JSON
    protected $casts = [
        'kelebihan' => 'array',
        'area_pengembangan' => 'array',
    ];

    // Relasi balik ke User (Siswa)
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Kelas extends Model
{
    use HasFactory;

    protected $table = 'kelas';

    protected $fillable = [
        'nama',
        'emoji',
        'pelatih',
        'theme',
    ];

    // Casting JSON ke Array otomatis saat diambil dari DB
    protected $casts = [
        'theme' => 'array',
    ];

    // Relasi: Satu Kelas memiliki banyak Siswa
    public function students(): HasMany
    {
        return $this->hasMany(User::class, 'kelas_id');
    }
}
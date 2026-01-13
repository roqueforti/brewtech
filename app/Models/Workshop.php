<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Workshop extends Model
{
    use HasFactory;

    protected $guarded = [];

    // Agar kolom JSON 'theme' otomatis jadi Array saat diambil
    protected $casts = [
        'theme' => 'array',
    ];

    // Tambahkan relasi ini
public function modules()
{
    return $this->belongsToMany(Module::class, 'module_workshop')
                ->withPivot('urutan')
                ->orderBy('pivot_urutan');
}
}
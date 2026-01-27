<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ModuleTool extends Model
{
    use HasFactory;

    // ✅ TAMBAHKAN INI:
    protected $fillable = [
        'module_id',
        'name',
        'media_url',
        'media_type',
    ];

    // Relasi balik ke Module (Opsional tapi bagus untuk ada)
    public function module()
    {
        return $this->belongsTo(Module::class);
    }
}
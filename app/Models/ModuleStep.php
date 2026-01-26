<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ModuleStep extends Model
{
    protected $guarded = [];

    // ✅ PERBAIKAN: Ganti 'workshop' menjadi 'module'
    public function module()
    {
        return $this->belongsTo(Module::class);
    }
}
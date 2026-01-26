<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ModuleQuestion extends Model
{
    protected $guarded = [];

    protected $casts = [
        'options' => 'array',       // Penting!
        'options_media' => 'array', // Penting!
    ];

    public function module()
    {
        return $this->belongsTo(Module::class);
    }
}
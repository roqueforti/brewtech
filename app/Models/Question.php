<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Question extends Model
{
    use HasFactory;

    protected $guarded = [];

    // Agar kolom JSON 'options' otomatis jadi Array
    protected $casts = [
        'options' => 'array',
    ];
}
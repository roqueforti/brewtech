<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StudentWorkshopProgress extends Model
{
    use HasFactory;

    protected $table = 'student_workshop_progress'; // Nama tabel eksplisit (kadang perlu)
    protected $guarded = [];
}
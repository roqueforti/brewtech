<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Workshop extends Model
{
    use HasFactory;

    // ✅ Ganti $fillable dengan $guarded = [] agar semua kolom boleh diisi
    protected $guarded = []; 

    // Relasi ke Steps
    public function steps()
    {
        // Pastikan nama FK benar (module_id atau workshop_id)
        // Di seeder tadi kita pakai 'module_id' di tabel steps, tapi parentnya workshop.
        // Sebaiknya konsisten. Jika tabel steps punya kolom 'module_id', definisikan disini:
        return $this->hasMany(ModuleStep::class, 'module_id'); 
        // ATAU jika tabel steps punya kolom 'workshop_id':
        // return $this->hasMany(ModuleStep::class, 'workshop_id');
    }

    // Relasi ke Questions
    public function questions()
    {
        return $this->hasMany(ModuleQuestion::class, 'module_id'); // Sesuaikan FK
    }
    
    // Relasi ke Kelas (Many to Many)
    public function kelas()
    {
        // Pastikan nama tabel pivot benar (misal: kelas_module atau kelas_workshop)
        return $this->belongsToMany(Kelas::class, 'kelas_module', 'module_id', 'kelas_id')
                    ->withPivot('order');
    }
}
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('kelas', function (Blueprint $table) {
            $table->id();
            $table->string('nama');     // Contoh: Morning Batch
            $table->string('emoji');    // Contoh: 🌅
            $table->string('pelatih');  // Contoh: Ms. Sari
            
            // Kolom JSON untuk menyimpan tema warna (agar dinamis & rapi)
            // Isinya nanti: {"bg": "bg-orange-100", "border": "border-orange-400", ...}
            $table->json('theme'); 
            
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('kelas');
    }
};
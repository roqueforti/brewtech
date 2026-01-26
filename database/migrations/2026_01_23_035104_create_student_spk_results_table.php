<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('student_spk_results', function (Blueprint $table) {
            $table->id();
            
            // Relasi ke User (Siswa)
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            
            // 1. Nilai Angka (Tetap disimpan sebagai dasar penentuan hasil)
            $table->float('nilai_hard_skill')->default(0);  // Rata-rata dari Pre/Post Test
            $table->float('nilai_soft_skill')->default(0);  // Rata-rata dari Observasi & Tes Soft
            $table->float('nilai_akhir')->default(0);       // Nilai Gabungan (Total)
            
            // 2. Hasil SPK (Rekomendasi Akhir)
            // Isinya nanti hanya salah satu dari:
            // - "Perlu Pelatihan Lanjutan"
            // - "Perlu Pendampingan"
            // - "Siap Praktek Kerja"
            $table->string('rekomendasi')->nullable(); 
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('student_spk_results');
    }
};
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('student_spk_results', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            
            // Ringkasan Nilai (Bisa dihitung otomatis, tapi disimpan untuk cache juga oke)
            $table->integer('avg_pretest')->default(0);
            $table->integer('avg_posttest')->default(0);
            $table->integer('avg_activity')->default(0);

            // Hasil SPK
            $table->string('predikat_kompetensi'); // Contoh: "KOMPETEN"
            $table->string('predikat_pengetahuan'); // Contoh: "Baik"
            $table->string('predikat_keterampilan'); // Contoh: "Sangat Baik"
            $table->string('predikat_sikap'); // Contoh: "Baik"

            // Analisis Detail (Simpan sebagai JSON Array)
            $table->json('kelebihan')->nullable(); // ["Teliti", "Cepat Paham"]
            $table->json('area_pengembangan')->nullable(); // ["Kecepatan", "Latihan"]

            $table->integer('nilai_keseluruhan')->default(0); // 0-100
            $table->text('rekomendasi_selanjutnya')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('student_spk_results');
    }
};
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
    // 1. Tabel Langkah-Langkah Praktikum
    Schema::create('module_steps', function (Blueprint $table) {
        $table->id();
        $table->foreignId('module_id')->constrained('modules')->onDelete('cascade');
        $table->integer('order')->default(1); // Urutan langkah (1, 2, 3...)
        $table->string('title'); // Judul langkah (misal: "Persiapan Alat")
        $table->text('description'); // Detail langkah
        $table->timestamps();
    });

    // 2. Tabel Bank Soal (Pre-Test & Post-Test)
    Schema::create('module_questions', function (Blueprint $table) {
        $table->id();
        $table->foreignId('module_id')->constrained('modules')->onDelete('cascade');
        $table->enum('type', ['pre_test', 'post_test']);
        $table->text('question');
        $table->json('options'); // Menyimpan Array ["A", "B", "C", "D"]
        $table->string('correct_answer'); // Kunci jawaban (misal: "A")
        $table->timestamps();
    });
}

public function down(): void
{
    Schema::dropIfExists('module_questions');
    Schema::dropIfExists('module_steps');
}
};

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

    // 2. Tabel Nilai & Progres Siswa
    Schema::create('student_workshops', function (Blueprint $table) {
        $table->id();
        $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
        $table->foreignId('workshop_id')->constrained('workshops')->onDelete('cascade');
        $table->enum('status', ['pending', 'completed'])->default('pending');
        $table->integer('score')->default(0); // Nilai 0-100
        $table->timestamp('completed_at')->nullable();
        $table->timestamps();
    });

    // 3. Tabel Riwayat Aktivitas (Log)
    Schema::create('student_activities', function (Blueprint $table) {
        $table->id();
        $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
        $table->string('title'); // Contoh: "Menyelesaikan Modul V60"
        $table->enum('type', ['completion', 'submission', 'login']); 
        $table->integer('score')->nullable(); // Jika ada nilai
        $table->timestamps();
    });
}

public function down(): void
{
    Schema::dropIfExists('student_activities');
    Schema::dropIfExists('student_workshops');
    Schema::dropIfExists('workshops');
}
};

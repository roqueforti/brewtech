<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Pivot Kelas <-> Module (Tetap)
        Schema::create('kelas_module', function (Blueprint $table) {
            $table->id();
            $table->foreignId('kelas_id')->constrained('kelas')->onDelete('cascade');
            $table->foreignId('module_id')->constrained('modules')->onDelete('cascade');
            $table->integer('order')->default(0);
            $table->timestamps();
        });

        // 2. Progress Siswa (Tetap)
        Schema::create('student_module_progress', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('module_id')->constrained('modules')->onDelete('cascade');
            $table->string('status')->default('locked');
            $table->integer('pretest_score')->nullable();
            $table->integer('posttest_score')->nullable();
            $table->string('photo_url')->nullable();
            $table->timestamps();
        });

        // 3. Update User (HANYA tambahkan kelas_id)
        Schema::table('users', function (Blueprint $table) {
            // Kita hanya inject foreign key kelas_id di sini karena tabel kelas sudah ada
            if (!Schema::hasColumn('users', 'kelas_id')) {
                $table->foreignId('kelas_id')->nullable()->constrained('kelas')->onDelete('set null');
            }
        });

        // 4. Tabel Activity Log (Tetap)
        Schema::create('student_activities', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('title');
            $table->string('type'); 
            $table->integer('score')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('student_activities');
        Schema::dropIfExists('student_module_progress');
        Schema::dropIfExists('kelas_module');
    }
};
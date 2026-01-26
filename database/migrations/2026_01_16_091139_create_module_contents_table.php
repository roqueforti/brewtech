<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Module Steps (Sudah Benar)
        Schema::create('module_steps', function (Blueprint $table) {
            $table->id();
            $table->foreignId('module_id')->constrained('modules')->onDelete('cascade');
            $table->string('title');
            $table->text('description');
            $table->string('media_type')->nullable(); 
            $table->string('media_url')->nullable();
            $table->timestamps();
        });

        // 2. Module Questions (❌ PERBAIKI DI SINI)
        Schema::create('module_questions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('module_id')->constrained('modules')->onDelete('cascade');
            $table->enum('type', ['pre_test', 'post_test']);
            $table->text('question');
            
            // ✅ TAMBAHKAN KOLOM INI:
            $table->string('media_type')->nullable(); // image/video
            $table->string('media_url')->nullable();  // path file
            
            $table->json('options'); 
            $table->string('correct_answer');
            $table->json('options_media')->nullable(); // Media untuk A, B, C, D
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('module_questions');
        Schema::dropIfExists('module_steps');
    }
};
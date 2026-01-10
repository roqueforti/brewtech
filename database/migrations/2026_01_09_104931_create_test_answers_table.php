<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('test_answers', function (Blueprint $table) {
            $table->id();

            // PERBAIKAN: Ubah student_id -> user_id
            $table->foreignId('user_id')
                ->constrained('users') // Arahkan ke tabel users
                ->cascadeOnDelete();

            // Pastikan tabel workshops & questions sudah dibuat sebelumnya
            $table->foreignId('workshop_id')
                ->constrained('workshops') 
                ->cascadeOnDelete();

            $table->foreignId('question_id')
                ->constrained('questions')
                ->cascadeOnDelete();

            $table->enum('test_type', ['pretest', 'posttest']);
            $table->char('selected_answer', 1);
            $table->boolean('is_correct');
            $table->timestamp('answered_at')->useCurrent();
            $table->timestamps();

            // PERBAIKAN: Update unique index
            $table->unique([
                'user_id',      // Ubah student_id -> user_id
                'question_id',
                'test_type'
            ]);
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('test_answers');
    }
};
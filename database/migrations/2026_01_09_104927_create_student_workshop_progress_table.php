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
    Schema::create('student_workshop_progress', function (Blueprint $table) {
        $table->id();
        $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
        $table->foreignId('workshop_id')->constrained('workshops')->cascadeOnDelete();
        
        $table->enum('status', ['locked', 'available', 'in_progress', 'completed'])->default('locked');
        
        // Skor-skor
        $table->integer('pretest_score')->nullable();
        $table->integer('posttest_score')->nullable();
        
        // Penanda Praktikum
        $table->boolean('praktikum_completed')->default(false);
        
        // Upload Foto
        $table->string('photo_submission_url')->nullable();
        $table->timestamp('photo_submitted_at')->nullable();
        
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('student_workshop_progress');
    }
};
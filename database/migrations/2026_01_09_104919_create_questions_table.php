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
    Schema::create('questions', function (Blueprint $table) {
        $table->id();
        $table->foreignId('workshop_id')->constrained('workshops')->cascadeOnDelete();
        
        $table->text('question_text');
        $table->json('options'); // Pilihan Ganda [A,B,C,D]
        $table->string('correct_answer'); // Kunci Jawaban (misal: 'B')
        $table->enum('type', ['pretest', 'posttest']); // Jenis Soal
        
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('questions');
    }
};

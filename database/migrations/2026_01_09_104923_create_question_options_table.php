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
        Schema::create('question_options', function (Blueprint $table) {
            $table->id();
            $table->foreignId('question_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->char('option_letter', 1);
            $table->text('option_text');
            $table->string('option_image_url')->nullable();
            $table->string('emoji', 10)->nullable();
            $table->timestamps();

            $table->unique(['question_id', 'option_letter']);
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('question_options');
    }
};

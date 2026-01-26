<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
{
    Schema::table('student_module_progress', function (Blueprint $table) {
        // Nilai dari Pengajar (Barista)
        $table->json('trainer_soft_details')->nullable(); 
        $table->integer('trainer_score')->nullable();
        $table->text('trainer_notes')->nullable();

        // Nilai dari Guru (Sekolah)
        $table->json('teacher_soft_details')->nullable();
        $table->integer('teacher_score')->nullable();
        $table->text('teacher_notes')->nullable();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('progress', function (Blueprint $table) {
            //
        });
    }
};

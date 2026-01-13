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
    // 1. Tabel Master Modul (Bank Data)
    Schema::create('modules', function (Blueprint $table) {
        $table->id();
        $table->string('title');
        $table->text('description')->nullable();
        $table->string('video_url')->nullable(); // Opsional: Link materi video
        $table->string('duration')->nullable();  // Opsional: "10 Menit"
        $table->enum('category', ['beginner', 'intermediate', 'advanced'])->default('beginner');
        $table->timestamps();
    });

    // 2. Tabel Pivot (Penghubung Workshop <-> Modul)
    Schema::create('module_workshop', function (Blueprint $table) {
        $table->id();
        $table->foreignId('workshop_id')->constrained('workshops')->onDelete('cascade');
        $table->foreignId('module_id')->constrained('modules')->onDelete('cascade');
        $table->integer('urutan')->default(1); // Agar bisa diurutkan (Modul 1, Modul 2, dst)
        $table->timestamps();
    });
}

public function down(): void
{
    Schema::dropIfExists('module_workshop');
    Schema::dropIfExists('modules');
}
};

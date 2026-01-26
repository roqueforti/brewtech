<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Tabel Kelas
        Schema::create('kelas', function (Blueprint $table) {
            $table->id();
            $table->string('nama');
            $table->string('emoji')->nullable();
            $table->string('pelatih')->nullable();
            $table->string('periode')->nullable();
            $table->text('deskripsi')->nullable();
            $table->string('theme')->default('blue');
            $table->string('status')->default('Aktif');
            $table->timestamps();
        });

        // 2. Tabel Modules (Dulu Workshops)
        Schema::create('modules', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            // $table->string('category')->nullable();
            // $table->string('duration')->nullable();
            $table->text('description')->nullable();
            $table->string('emoji')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('modules');
        Schema::dropIfExists('kelas');
    }
};
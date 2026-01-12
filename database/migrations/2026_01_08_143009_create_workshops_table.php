<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('workshops', function (Blueprint $table) {
            $table->id();
            
            // Data Utama
            $table->string('title');
            $table->string('subtitle')->nullable();
            $table->text('description')->nullable();
            $table->string('emoji')->default('📚'); // Ikon
            $table->string('theme')->default('green'); // Warna tema
            
            // Relasi ke Kelas (LANGSUNG KITA BUAT DI SINI)
            $table->foreignId('kelas_id')
                  ->nullable()
                  ->constrained('kelas')
                  ->onDelete('set null');

            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('workshops');
    }
};
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
public function up()
{
    Schema::create('kelas', function (Blueprint $table) {
        $table->id();
        $table->string('nama');
        $table->string('emoji')->nullable(); // 👈 TAMBAHKAN INI
        $table->string('pelatih');
        $table->string('periode');
        $table->text('deskripsi')->nullable();
        $table->string('theme')->default('green');
        $table->enum('status', ['Aktif', 'Selesai', 'Draft'])->default('Aktif');
        $table->timestamps();
    });
}
    public function down(): void
    {
        Schema::dropIfExists('kelas');
    }
};
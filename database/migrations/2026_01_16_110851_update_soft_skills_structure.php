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
    // 1. Tambah kolom konfigurasi kriteria di tabel modules
    Schema::table('modules', function (Blueprint $table) {
        $table->json('soft_skill_config')->nullable()->after('description'); 
        // Contoh isi: ["Kebersihan", "Kerjasama", "Ketepatan Waktu"]
    });

    // 2. Ubah kolom nilai soft skill di progress jadi JSON agar bisa simpan detail
    Schema::table('student_module_progress', function (Blueprint $table) {
        // Kita ubah tipe datanya (jika sqlite/mysql versi lama mungkin butuh raw query, tapi ini cara standar laravel)
        $table->json('soft_skill_details')->nullable()->after('soft_skill_score'); 
        // Contoh isi: {"Kebersihan": 80, "Kerjasama": 90}
        $table->json('trainer_soft_details')->nullable(); // Nilai detail dari Pelatih
        $table->integer('trainer_score')->nullable();     // Rata-rata Pelatih
        $table->text('trainer_notes')->nullable();

        $table->json('teacher_soft_details')->nullable(); // Nilai detail dari Guru
        $table->integer('teacher_score')->nullable();     // Rata-rata Guru
        $table->text('teacher_notes')->nullable();
    });
}

public function down(): void
{
    Schema::table('modules', function (Blueprint $table) {
        $table->dropColumn('soft_skill_config');
    });
    Schema::table('student_module_progress', function (Blueprint $table) {
        $table->dropColumn('soft_skill_details');
    });
}
};

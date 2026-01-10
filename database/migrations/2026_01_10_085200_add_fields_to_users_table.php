<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Menambahkan Role (student/instructor/admin)
            $table->string('role')->default('student')->after('email');
            
            // Relasi ke tabel Kelas (Boleh null jika user adalah Admin/Pengajar)
            $table->foreignId('kelas_id')
                  ->nullable()
                  ->after('role')
                  ->constrained('kelas')
                  ->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['kelas_id']);
            $table->dropColumn(['role', 'kelas_id']);
        });
    }
};
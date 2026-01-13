<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // ✅ CEK DULU: Hanya tambahkan jika kolom BELUM ada
            if (!Schema::hasColumn('users', 'kelas_id')) {
                $table->foreignId('kelas_id')
                      ->nullable()
                      ->after('id')
                      ->constrained('kelas')
                      ->onDelete('set null');
            }
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            if (Schema::hasColumn('users', 'kelas_id')) {
                $table->dropForeign(['kelas_id']);
                $table->dropColumn('kelas_id');
            }
        });
    }
};
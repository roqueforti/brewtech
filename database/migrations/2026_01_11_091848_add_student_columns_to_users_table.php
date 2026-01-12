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
    Schema::table('users', function (Blueprint $table) {
        
        // Cek dulu: Kalau kolom 'kelas_id' BELUM ada, baru buat.
        if (!Schema::hasColumn('users', 'kelas_id')) {
            $table->foreignId('kelas_id')->nullable()->constrained('kelas')->onDelete('set null'); 
        }

        if (!Schema::hasColumn('users', 'pre_test_score')) {
            $table->integer('pre_test_score')->default(0)->nullable();
        }

        if (!Schema::hasColumn('users', 'post_test_score')) {
            $table->integer('post_test_score')->default(0)->nullable();
        }

        if (!Schema::hasColumn('users', 'status_pkl')) {
            $table->enum('status_pkl', ['belum_siap', 'siap', 'dalam_pelatihan'])->default('dalam_pelatihan');
        }
    });
}

public function down()
{
    Schema::table('users', function (Blueprint $table) {
        // Hapus foreign key dulu baru kolomnya
        $table->dropForeign(['kelas_id']);
        $table->dropColumn(['kelas_id', 'pre_test_score', 'post_test_score', 'status_pkl']);
    });
}
};

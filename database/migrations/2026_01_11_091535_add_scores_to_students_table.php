<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            
            // ❌ HAPUS ATAU KOMENTARI BARIS INI (KARENA SUDAH ADA)
            // $table->foreignId('kelas_id')->nullable()->constrained('kelas')->onDelete('set null'); 

            // ✅ BIARKAN YANG INI (KARENA BELUM ADA)
            $table->integer('pre_test_score')->default(0)->nullable();
            $table->integer('post_test_score')->default(0)->nullable();
            $table->enum('status_pkl', ['belum_siap', 'siap', 'dalam_pelatihan'])->default('dalam_pelatihan');
        });
    }

    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            // ❌ HAPUS INI JUGA AGAR AMAN
            // $table->dropForeign(['kelas_id']); 
            // $table->dropColumn('kelas_id');

            // ✅ CUKUP DROP YANG BARU DIBUAT
            $table->dropColumn(['pre_test_score', 'post_test_score', 'status_pkl']);
        });
    }
};
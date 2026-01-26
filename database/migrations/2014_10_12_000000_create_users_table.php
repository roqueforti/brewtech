<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
// database/migrations/xxxx_xx_xx_create_users_table.php
public function up(): void
{
    Schema::create('users', function (Blueprint $table) {
        $table->id();
        $table->string('name');
        $table->string('email')->unique();
        $table->timestamp('email_verified_at')->nullable();
        $table->string('password');
        
        // ✅ TAMBAHKAN KOLOM INI DISINI
        $table->string('role')->default('student');
        $table->string('phone')->nullable();
        $table->integer('age')->nullable();
        $table->string('school_grade')->nullable();
        $table->string('disability')->nullable();
        $table->string('status_pkl')->default('baru_daftar');
        $table->integer('pre_test_score')->nullable();
        $table->integer('post_test_score')->nullable();
        
        $table->rememberToken();
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};

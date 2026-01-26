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
    Schema::table('kelas_module', function (Blueprint $table) {
        $table->dateTime('opens_at')->nullable(); // Tanggal & Jam dibuka
        $table->boolean('is_active')->default(true); // Status Aktif/Inaktif
    });
}

public function down(): void
{
    Schema::table('kelas_module', function (Blueprint $table) {
        $table->dropColumn(['opens_at', 'is_active']);
    });
}
};

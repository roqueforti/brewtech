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
    Schema::table('users', function (Blueprint $table) {
        // Menambahkan kolom baru setelah email
        $table->string('phone')->nullable()->after('email');
        $table->integer('age')->nullable()->after('phone');
        $table->string('school_grade')->nullable()->after('age'); // Misal: Kelas 12
        $table->string('disability')->nullable()->after('school_grade'); // Misal: Tuna Rungu
    });
}

public function down(): void
{
    Schema::table('users', function (Blueprint $table) {
        $table->dropColumn(['phone', 'age', 'school_grade', 'disability']);
    });
}
};

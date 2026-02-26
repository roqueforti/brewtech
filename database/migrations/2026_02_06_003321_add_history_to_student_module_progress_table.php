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
    Schema::table('student_module_progress', function (Blueprint $table) {
        // Menambahkan kolom history tipe JSON (atau text jika database lama)
        $table->json('history')->nullable()->after('status');
    });
}

public function down()
{
    Schema::table('student_module_progress', function (Blueprint $table) {
        $table->dropColumn('history');
    });
}
};

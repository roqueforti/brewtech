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
    Schema::table('student_workshop_progress', function (Blueprint $table) {
        // Menambahkan kolom photo_url yang boleh kosong (nullable)
        $table->string('photo_url')->nullable()->after('status'); 
    });
}

public function down()
{
    Schema::table('student_workshop_progress', function (Blueprint $table) {
        $table->dropColumn('photo_url');
    });
}
};

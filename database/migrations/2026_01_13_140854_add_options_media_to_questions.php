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
    Schema::table('module_questions', function (Blueprint $table) {
        // Kolom ini akan menyimpan array: [{url: '...', type: 'image'}, null, ...]
        $table->json('options_media')->nullable(); 
    });
}

public function down(): void
{
    Schema::table('module_questions', function (Blueprint $table) {
        $table->dropColumn('options_media');
    });
}
};

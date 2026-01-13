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
    Schema::table('module_steps', function (Blueprint $table) {
        $table->string('media_url')->nullable(); // Path file
        $table->string('media_type')->nullable(); // 'image' atau 'video'
    });

    Schema::table('module_questions', function (Blueprint $table) {
        $table->string('media_url')->nullable();
        $table->string('media_type')->nullable();
    });
}

public function down(): void
{
    Schema::table('module_steps', function (Blueprint $table) {
        $table->dropColumn(['media_url', 'media_type']);
    });
    Schema::table('module_questions', function (Blueprint $table) {
        $table->dropColumn(['media_url', 'media_type']);
    });
}
};

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
    Schema::table('student_module_progress', function (Blueprint $table) {
        $table->integer('soft_skill_score')->nullable()->after('posttest_score');
        $table->text('soft_skill_notes')->nullable()->after('soft_skill_score'); // Catatan observasi guru
    });
}

public function down(): void
{
    Schema::table('student_module_progress', function (Blueprint $table) {
        $table->dropColumn(['soft_skill_score', 'soft_skill_notes']);
    });
}
};

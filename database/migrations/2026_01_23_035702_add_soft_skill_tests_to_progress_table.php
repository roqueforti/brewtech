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
        $table->integer('pre_test_soft_score')->nullable()->after('posttest_score');
        $table->integer('post_test_soft_score')->nullable()->after('pre_test_soft_score');
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('progress', function (Blueprint $table) {
            //
        });
    }
};

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
    Schema::create('module_tools', function (Blueprint $table) {
        $table->id();
        $table->foreignId('module_id')->constrained()->onDelete('cascade');
        $table->string('name'); // Nama alat/bahan
        $table->string('media_url')->nullable(); // Foto alat/bahan
        $table->string('media_type')->nullable(); // 'image' or 'video'
        $table->timestamps();
    });
}

public function down()
{
    Schema::dropIfExists('module_tools');
}
};

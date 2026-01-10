<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
public function up(): void
    {
        Schema::create('workshops', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('subtitle')->nullable(); // Pastikan ini ada
            $table->string('emoji')->nullable();
            $table->text('description')->nullable();
            
            // KOLOM PENTING YANG TADI HILANG:
            $table->string('status')->default('active'); // 'active', 'locked', dll.
            
            // Kolom Theme (JSON)
            $table->json('theme')->nullable(); 
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('workshops');
    }
};

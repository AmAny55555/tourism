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
    Schema::create('destinations', function (Blueprint $table) {
        $table->id();

        $table->string('name');
        $table->string('slug')->unique();

        $table->string('location')->nullable();
        $table->string('category')->default('Economy Class');

        $table->decimal('price', 10, 2)->default(0);
        $table->decimal('rating', 2, 1)->default(4.5);
        $table->integer('days')->default(1);

        $table->string('badge')->nullable();
        $table->text('description')->nullable();

        $table->string('image')->nullable();

        $table->boolean('is_active')->default(true);

        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('destinations');
    }
};

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
    Schema::create('foreign_trip_requests', function (Blueprint $table) {
        $table->id();

        $table->foreignId('user_id')
              ->constrained()
              ->cascadeOnDelete();

        $table->foreignId('travel_country_id')
              ->constrained('travel_countries')
              ->cascadeOnDelete();

        $table->string('status')->default('under_review');
        $table->text('admin_notes')->nullable();
        $table->decimal('price', 10, 2)->nullable();

        $table->timestamps();
    });
}
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('foreign_trip_requests');
    }
};

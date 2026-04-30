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
    Schema::create('foreign_trip_answers', function (Blueprint $table) {
        $table->id();

        $table->foreignId('foreign_trip_request_id')
              ->constrained('foreign_trip_requests')
              ->cascadeOnDelete();

        $table->foreignId('travel_form_field_id')
              ->constrained('travel_form_fields')
              ->cascadeOnDelete();

        $table->text('value')->nullable();

        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('foreign_trip_answers');
    }
};

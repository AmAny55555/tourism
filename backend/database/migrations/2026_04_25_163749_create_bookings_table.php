<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')->constrained()->cascadeOnDelete();

            $table->string('destination');
            $table->unsignedTinyInteger('days_count');
            $table->date('travel_date');
            $table->unsignedTinyInteger('adults_count')->default(1);
            $table->unsignedTinyInteger('children_count')->default(0);

            $table->enum('trip_class', [
                'Economy Class',
                'Premium Economy Class',
                'Business Class',
                'First Class',
            ])->default('Economy Class');

            $table->text('notes')->nullable();

            $table->enum('status', [
                'under_review',
                'designed',
                'confirmed',
                'completed',
                'cancelled',
            ])->default('under_review');

            $table->integer('points_earned')->default(0);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};

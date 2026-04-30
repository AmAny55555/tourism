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
    Schema::create('travel_form_fields', function (Blueprint $table) {
        $table->id();

        $table->foreignId('travel_country_id')
              ->constrained('travel_countries')
              ->cascadeOnDelete();

        $table->string('label');
        $table->string('name');

        $table->enum('type', [
            'text',
            'email',
            'phone',
            'date',
            'select',
            'file',
            'textarea'
        ]);

        $table->json('options')->nullable();
        $table->boolean('is_required')->default(false);
        $table->integer('sort_order')->default(0);

        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('travel_form_fields');
    }
};

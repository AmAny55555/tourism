<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('travel_form_fields', function (Blueprint $table) {
            $table->unique(['travel_country_id', 'name'], 'unique_country_field_name');
        });
    }

    public function down(): void
    {
        Schema::table('travel_form_fields', function (Blueprint $table) {
            $table->dropUnique('unique_country_field_name');
        });
    }
};

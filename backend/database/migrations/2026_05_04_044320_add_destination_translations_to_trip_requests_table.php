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
    Schema::table('bookings', function (Blueprint $table) {
        $table->string('destination_ar')->nullable()->after('destination');
        $table->string('destination_en')->nullable()->after('destination_ar');
    });
}

public function down(): void
{
    Schema::table('bookings', function (Blueprint $table) {
        $table->dropColumn(['destination_ar', 'destination_en']);
    });
}

};

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('trip_designs', function (Blueprint $table) {
            $table->string('hotel_name_ar')->nullable()->after('hotel_name');
            $table->string('hotel_name_en')->nullable()->after('hotel_name_ar');

            $table->string('transport_type_ar')->nullable()->after('transport_type');
            $table->string('transport_type_en')->nullable()->after('transport_type_ar');
        });
    }

    public function down(): void
    {
        Schema::table('trip_designs', function (Blueprint $table) {
            $table->dropColumn([
                'hotel_name_ar',
                'hotel_name_en',
                'transport_type_ar',
                'transport_type_en',
            ]);
        });
    }
};

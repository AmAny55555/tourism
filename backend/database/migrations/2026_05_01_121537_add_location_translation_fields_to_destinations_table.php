<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('destinations', function (Blueprint $table) {
            $table->string('location_ar')->nullable()->after('location');
            $table->string('location_en')->nullable()->after('location_ar');
        });

        DB::table('destinations')->update([
            'location_ar' => DB::raw('location'),
            'location_en' => DB::raw('location'),
        ]);
    }

    public function down(): void
    {
        Schema::table('destinations', function (Blueprint $table) {
            $table->dropColumn(['location_ar', 'location_en']);
        });
    }
};
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('travel_countries', function (Blueprint $table) {
            $table->string('name_ar')->nullable()->after('name');
            $table->string('name_en')->nullable()->after('name_ar');
        });

        DB::table('travel_countries')->update([
            'name_ar' => DB::raw('name'),
            'name_en' => DB::raw('name'),
        ]);
    }

    public function down(): void
    {
        Schema::table('travel_countries', function (Blueprint $table) {
            $table->dropColumn(['name_ar', 'name_en']);
        });
    }
};
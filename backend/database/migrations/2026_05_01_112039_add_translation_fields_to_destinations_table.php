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
            $table->string('name_ar')->nullable()->after('name');
            $table->string('name_en')->nullable()->after('name_ar');

            $table->string('badge_ar')->nullable()->after('badge');
            $table->string('badge_en')->nullable()->after('badge_ar');

            $table->text('description_ar')->nullable()->after('description');
            $table->text('description_en')->nullable()->after('description_ar');

            $table->text('landmarks_ar')->nullable()->after('landmarks');
            $table->text('landmarks_en')->nullable()->after('landmarks_ar');

            $table->string('best_time_to_visit_ar')->nullable()->after('best_time_to_visit');
            $table->string('best_time_to_visit_en')->nullable()->after('best_time_to_visit_ar');
        });

        DB::table('destinations')->update([
            'name_ar' => DB::raw('name'),
            'name_en' => DB::raw('name'),

            'badge_ar' => DB::raw('badge'),
            'badge_en' => DB::raw('badge'),

            'description_ar' => DB::raw('description'),
            'description_en' => DB::raw('description'),

            'landmarks_ar' => DB::raw('landmarks'),
            'landmarks_en' => DB::raw('landmarks'),

            'best_time_to_visit_ar' => DB::raw('best_time_to_visit'),
            'best_time_to_visit_en' => DB::raw('best_time_to_visit'),
        ]);
    }

    public function down(): void
    {
        Schema::table('destinations', function (Blueprint $table) {
            $table->dropColumn([
                'name_ar',
                'name_en',
                'badge_ar',
                'badge_en',
                'description_ar',
                'description_en',
                'landmarks_ar',
                'landmarks_en',
                'best_time_to_visit_ar',
                'best_time_to_visit_en',
            ]);
        });
    }
};
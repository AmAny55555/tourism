<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('travel_form_fields', function (Blueprint $table) {
            if (!Schema::hasColumn('travel_form_fields', 'label_ar')) {
                $table->string('label_ar')->nullable()->after('label');
            }

            if (!Schema::hasColumn('travel_form_fields', 'label_en')) {
                $table->string('label_en')->nullable()->after('label_ar');
            }
        });
    }

    public function down(): void
    {
        Schema::table('travel_form_fields', function (Blueprint $table) {
            $table->dropColumn(['label_ar', 'label_en']);
        });
    }
};

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{

public function up(): void
{
    Schema::table('foreign_trip_answers', function (Blueprint $table) {
        $table->string('value_ar')->nullable()->after('value');
        $table->string('value_en')->nullable()->after('value_ar');
    });
}

public function down(): void
{
    Schema::table('foreign_trip_answers', function (Blueprint $table) {
        $table->dropColumn(['value_ar', 'value_en']);
    });
}
};

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
    Schema::table('destinations', function (Blueprint $table) {
        $table->string('cover_image')->nullable()->after('image');

        $table->text('overview')->nullable()->after('description');

        $table->text('landmarks')->nullable();
        // هتخزنيها JSON (زي array)

        $table->string('best_time_to_visit')->nullable();

        $table->boolean('is_featured')->default(false);
    });
}

    /**
     * Reverse the migrations.
     */
public function down(): void
{
    Schema::table('destinations', function (Blueprint $table) {
        $table->dropColumn([
            'cover_image',
            'overview',
            'landmarks',
            'best_time_to_visit',
            'is_featured'
        ]);
    });
}
};

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('notifications', function (Blueprint $table) {
            $table->string('title_ar')->nullable()->after('message');
            $table->string('title_en')->nullable()->after('title_ar');
            $table->text('message_ar')->nullable()->after('title_en');
            $table->text('message_en')->nullable()->after('message_ar');
        });
    }

    public function down(): void
    {
        Schema::table('notifications', function (Blueprint $table) {
            $table->dropColumn([
                'title_ar',
                'title_en',
                'message_ar',
                'message_en',
            ]);
        });
    }
};

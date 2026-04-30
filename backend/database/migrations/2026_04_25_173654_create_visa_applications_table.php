<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('visa_applications', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')->constrained()->cascadeOnDelete();

            $table->string('country')->default('الإمارات');
            $table->string('nationality');
            $table->string('emirate');
            $table->date('travel_date');
            $table->string('from_country');
            $table->string('passport_number');
            $table->string('job');
            $table->date('passport_expiry');

            $table->string('full_name');
            $table->string('email');
            $table->string('phone');

            $table->string('face_photo');
            $table->string('passport_copy');
            $table->string('passport_cover');
            $table->string('national_id');
            $table->string('bank_statement');
            $table->string('police_certificate');
            $table->string('extra_document')->nullable();

            $table->string('status')->default('under_review');

            $table->decimal('price', 10, 2)->nullable();
            $table->text('admin_notes')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('visa_applications');
    }
};

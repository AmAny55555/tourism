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
    Schema::create('foreign_payments', function (Blueprint $table) {
        $table->id();

        $table->foreignId('foreign_trip_request_id')
              ->constrained()
              ->cascadeOnDelete();

        $table->string('method'); // vodafone_cash / instapay
        $table->string('transaction_reference');

        $table->text('notes')->nullable();

        $table->decimal('amount', 10, 2);

        $table->enum('status', ['pending', 'approved', 'rejected'])
              ->default('pending');

        $table->timestamps();
    });
}
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('foreign_payments');
    }
};

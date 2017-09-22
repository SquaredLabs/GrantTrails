<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatePurchasesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('purchases', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('location_id')
                  ->unsigned()
                  ->nullable();
            $table->decimal('amount', 11, 2)->nullable();
            $table->integer('fiscal_year')->nullable();
            $table->integer('expense_category_id')
                  ->unsigned()
                  ->nullable();
            $table->integer('agency_type_id')
                  ->unsigned()
                  ->nullable();
            $table->string('transaction_date')->nullable();
            $table->timestamps();

            $table->foreign('location_id')
                  ->references('id')
                  ->on('locations')
                  ->onDelete('cascade');

            $table->foreign('expense_category_id')
                ->references('id')
                ->on('expense_categories')
                ->onDelete('cascade');

            $table->foreign('agency_type_id')
                ->references('id')
                ->on('agency_types')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('purchases');
    }
}

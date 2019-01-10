<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateUnitsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('units', function (Blueprint $table) {
            $table->increments('id');
            $table->string('serial')->unique();
            $table->timestamp('assembly_date')->nullable();
            $table->string('qaqc')->default('')->nullable();
            $table->string('mainboard')->default('')->nullable();
            $table->string('mcuboard')->default('')->nullable();
            $table->string('inputboard1')->default('')->nullable();
            $table->string('inputboard2')->default('')->nullable();
            $table->string('inputboard3')->default('')->nullable();
            $table->string('inputboard4')->default('')->nullable();
            $table->string('software_reg_key')->default('')->nullable();
            $table->string('status')->default('')->nullable();
            $table->timestamp('active_date')->nullable();
            $table->string('os')->default('')->nullable();
            $table->integer('active_licenses_count')->default(0)->nullable();
            $table->string('firstname')->default('')->nullable();
            $table->string('lastname')->default('')->nullable();
            $table->string('location')->default('')->nullable();
            $table->string('email')->default('')->nullable();
            $table->string('phone')->default('')->nullable();
            $table->string('warranty_type')->default('')->nullable();
            $table->string('warranty_claims')->default('')->nullable();
            $table->timestamp('warranty_active_date')->nullable();
            $table->string('customer_notes')->default('')->nullable();
            $table->integer('is_repairing')->default(0);
            $table->integer('is_decommissioned')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('units');
    }
}

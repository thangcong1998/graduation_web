<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateFunctionAccessVehicleRelationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('function_access_vehicle_relations', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('access_vehicle_id')->unsigned();
            $table->foreign('access_vehicle_id')->references('id')->on('m_access_vehicles')->onDelete("cascade");
            $table->bigInteger('function_id')->unsigned();
            $table->foreign('function_id')->references('id')->on('m_functions')->onDelete("cascade");
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
        Schema::dropIfExists('function_access_vehicle_relations');
    }
}

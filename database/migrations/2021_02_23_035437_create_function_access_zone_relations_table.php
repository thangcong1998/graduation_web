<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateFunctionAccessZoneRelationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('function_access_zone_relations', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('access_zone_id')->unsigned();
            $table->foreign('access_zone_id')->references('id')->on('m_access_zones')->onDelete("cascade");
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
        Schema::dropIfExists('function_access_zone_relations');
    }
}

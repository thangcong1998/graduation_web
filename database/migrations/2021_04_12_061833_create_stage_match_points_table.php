<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateStageMatchPointsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('stage_match_points', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('stage_id')->unsigned();
            $table->foreign('stage_id')->references('id')->on('stages')->onDelete('cascade');
            $table->string('point_name');
            $table->double('points');
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
        Schema::dropIfExists('stage_match_points');
    }
}

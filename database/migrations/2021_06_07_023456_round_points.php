<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class RoundPoints extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        //
        Schema::create('round_points', function (Blueprint $table) {
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
        Schema::dropIfExists('round_points');
    }
}

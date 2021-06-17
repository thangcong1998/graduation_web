<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateEventUniformColorsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('event_uniform_colors', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('team_id')->unsigned();
            $table->foreign('team_id')->references('id')->on('team')->onDelete('cascade');
            $table->bigInteger('event_team_id')->unsigned()->nullable();
            $table->foreign('event_team_id')->references('id')->on('event_teams')->onDelete('cascade');
            $table->bigInteger('event_id')->unsigned();
            $table->foreign('event_id')->references('id')->on('sport_discipline_events')->onDelete('cascade');
            $table->integer('no')->unsigned();
            $table->string('player_shirt')->nullable();
            $table->string('player_shorts')->nullable();
            $table->string('player_shocks')->nullable();
            $table->string('goalkeeper_shirt')->nullable();
            $table->string('goalkeeper_shorts')->nullable();
            $table->string('goalkeeper_shocks')->nullable();
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
        Schema::dropIfExists('event_uniform_colors');
    }
}

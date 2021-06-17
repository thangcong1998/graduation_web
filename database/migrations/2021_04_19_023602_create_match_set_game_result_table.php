<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMatchSetGameResultTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('match_set_game_result', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('match_set_id')->unsigned();
            $table->foreign('match_set_id')->references('id')->on('match_sets')->onDelete('cascade');
            $table->integer('set_game_no')->nullable();
            $table->tinyInteger('score')->nullable();
            $table->tinyInteger('match_event_team_id')->nullable();
            $table->tinyInteger('match_invididual_competitor_id')->nullable();
            $table->tinyInteger('competitor_id')->nullable();
            $table->tinyInteger('event_team_id')->nullable();
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
        Schema::dropIfExists('match_set_game_result');
    }
}

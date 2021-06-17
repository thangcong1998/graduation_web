<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMatchEventTeamsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('match_event_teams', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('match_id')->unsigned();
            $table->foreign('match_id')->references("id")->on('matches')->onDelete('cascade');
            $table->bigInteger('event_team_id')->unsigned();
            $table->foreign('event_team_id')->references('id')->on('event_teams')->onDelete('cascade');
            $table->string('final_score')->nullable();
            $table->tinyInteger('is_winner')->nullable();
            $table->tinyInteger('is_qualified')->nullable();
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
        Schema::dropIfExists('match_event_teams');
    }
}

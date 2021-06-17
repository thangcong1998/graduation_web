<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMatchEventTeamStartlistTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('match_event_team_startlist', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('match_event_team_id')->unsigned();
            $table->foreign('match_event_team_id')->references('id')->on('match_event_teams')->onDelete('cascade');
            $table->bigInteger('event_team_id')->unsigned();
            $table->foreign('event_team_id')->references('id')->on('event_teams')->onDelete('cascade');
            $table->bigInteger('competitor_id')->unsigned();
            $table->foreign('competitor_id')->references('id')->on('participants')->onDelete('cascade');
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
        Schema::dropIfExists('match_event_team_startlist');
    }
}

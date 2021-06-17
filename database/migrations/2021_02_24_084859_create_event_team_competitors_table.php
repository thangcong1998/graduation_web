<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateEventTeamCompetitorsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('event_team_competitors', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('event_team_id')->unsigned();
            $table->foreign('event_team_id')->references('id')->on('event_teams')->onDelete('cascade');
            $table->bigInteger('competitor_id')->unsigned();
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
        Schema::dropIfExists('event_team_competitors');
    }
}

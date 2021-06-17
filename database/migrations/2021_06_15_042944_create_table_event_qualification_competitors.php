<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTableEventQualificationCompetitors extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('event_qualification_competitors', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('event_id')->unsigned();
            $table->foreign('event_id')->references('id')->on('sport_discipline_events')->onDelete('cascade');
            $table->bigInteger('participant_id')->unsigned();
            $table->foreign('participant_id')->references('id')->on('participants')->onDelete('cascade');
            $table->bigInteger('event_team_id')->unsigned();
            $table->foreign('event_team_id')->references('id')->on('event_teams')->onDelete('cascade');
            $table->bigInteger('team_id')->unsigned();
            $table->foreign('team_id')->references('id')->on('team')->onDelete('cascade');
            $table->tinyInteger('qualification_type')->unsigned();
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
        Schema::dropIfExists('table_event_qualification_competitors');
    }
}

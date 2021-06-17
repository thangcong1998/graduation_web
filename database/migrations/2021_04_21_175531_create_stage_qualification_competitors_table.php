<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateStageQualificationCompetitorsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('stage_qualification_competitors', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('stage_id')->unsigned();
            $table->foreign('stage_id')->references('id')->on('stages')->onDelete("cascade");
            $table->tinyInteger('qualification_type');
            $table->bigInteger('qualified_to_stage_id')->unsigned()->nullable();
            $table->foreign('qualified_to_stage_id')->references('id')->on('stages')->onDelete("cascade");
            $table->bigInteger('competitor_individual_event_relation_id')->unsigned()->nullable();
            $table->foreign('competitor_individual_event_relation_id', 'relation_id')->references('id')->on('competitor_individual_event_relations')->onDelete('cascade');
            $table->bigInteger('participant_id')->unsigned()->nullable();
            $table->foreign('participant_id')->references('id')->on('participants')->onDelete("cascade");
            $table->bigInteger('event_team_id')->unsigned()->nullable();
            $table->foreign('event_team_id')->references('id')->on('event_teams')->onDelete("cascade");
            $table->bigInteger('team_id')->unsigned()->nullable();
            $table->foreign('team_id')->references('id')->on('team')->onDelete("cascade");
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
        Schema::dropIfExists('stage_qualification_competitors');
    }
}

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMatchSubCriteriasRelationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('match_sub_criterias_relations', function (Blueprint $table) {
            $table->id();
            $table->bigInteger("event_id")->unsigned();
            $table->foreign("event_id")->references("id")->on("sport_discipline_events")->onDelete("cascade");
            $table->bigInteger("match_id")->unsigned();
            $table->foreign("match_id")->references("id")->on("matches")->onDelete("cascade");
            $table->bigInteger("stage_id")->unsigned();
            $table->foreign("stage_id")->references("id")->on("stages")->onDelete("cascade");
            $table->bigInteger("sub_criteria_id")->unsigned();
            $table->foreign("sub_criteria_id")->references("id")->on("sub_criterias")->onDelete("cascade");
            $table->bigInteger("event_team_id")->unsigned()->nullable();
            $table->foreign("event_team_id")->references("id")->on("event_teams")->onDelete("cascade");
            $table->bigInteger("competitor_id")->unsigned()->nullable();
            $table->foreign("competitor_id")->references("id")->on("participants")->onDelete("cascade");
            $table->float("value")->nullable()->default(0);
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
        Schema::dropIfExists('match_sub_criterias_relations');
    }
}

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateEventStatisticsMatchRelationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('event_statistics_match_relations', function (Blueprint $table) {
            $table->id();
            $table->bigInteger("event_statistic_id")->unsigned();
            $table->foreign("event_statistic_id")->references("id")->on("event_statistics")->onDelete("cascade");
            $table->bigInteger("competitor_id")->unsigned()->nullable();
            $table->foreign("competitor_id")->references("id")->on("participants")->onDelete("cascade");
            $table->bigInteger("event_team_id")->unsigned()->nullable();
            $table->foreign("event_team_id")->references("id")->on("event_teams")->onDelete("cascade");
            $table->bigInteger("match_id")->unsigned();
            $table->foreign("match_id")->references("id")->on("matches")->onDelete("cascade");
            $table->string("value");
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
        Schema::dropIfExists('event_statistics_match_relations');
    }
}

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMatchRoundResultTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('match_round_result', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('match_round_id')->unsigned()->nullable();
            $table->foreign('match_round_id')->references('id')->on('match_rounds')->onDelete('cascade');
            $table->bigInteger('match_individual_competitor_id')->unsigned()->nullable();
            $table->foreign('match_individual_competitor_id')->references('id')->on('match_individual_competitors')->onDelete('cascade');
            $table->bigInteger('match_event_team_id')->unsigned()->nullable();
            $table->foreign('match_event_team_id')->references('id')->on('match_event_teams')->onDelete('cascade');
            $table->bigInteger('competitor_id')->unsigned()->nullable();
            $table->foreign('competitor_id')->references('id')->on('participants')->onDelete('cascade');
            $table->bigInteger('event_team_id')->unsigned()->nullable();
            $table->foreign('event_team_id')->references('id')->on('event_teams')->onDelete('cascade');
            $table->string('score');
            $table->string('turn')->nullable();
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
        Schema::dropIfExists('match_round_result');
    }
}

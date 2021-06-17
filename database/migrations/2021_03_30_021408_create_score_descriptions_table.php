<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateScoreDescriptionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('score_descriptions', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('match_round_result_referee_id')->unsigned();
            $table->foreign('match_round_result_referee_id')->references('id')->on('match_round_result_referee_relations')->onDelete('cascade');
            $table->bigInteger('event_team_id')->unsigned();
            $table->foreign('event_team_id')->references('id')->on('event_teams')->onDelete('cascade');
            $table->bigInteger('competitor_id')->unsigned();
            $table->foreign('competitor_id')->references('id')->on('participants')->onDelete('cascade');
            $table->time('match_time');
            $table->string('score');
            $table->bigInteger('reason_id')->unsigned();
            $table->foreign('reason_id')->references('id')->on('fouls')->onDelete('cascade');
            $table->text('description');
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
        Schema::dropIfExists('score_descriptions');
    }
}

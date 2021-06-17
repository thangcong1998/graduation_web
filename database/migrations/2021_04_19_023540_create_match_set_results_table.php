<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMatchSetResultsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('match_set_results', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('match_set_id')->unsigned();
            $table->foreign('match_set_id')->references('id')->on('match_sets')->onDelete('cascade');
            $table->integer('score')->nullable();
            $table->integer('set_point')->nullable();
            $table->bigInteger('match_event_team_id')->nullable();
            $table->bigInteger('match_individual_competitor_id')->nullable();
            $table->bigInteger('competitor_id')->nullable();
            $table->bigInteger('event_team_id')->nullable();
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
        Schema::dropIfExists('match_set_results');
    }
}

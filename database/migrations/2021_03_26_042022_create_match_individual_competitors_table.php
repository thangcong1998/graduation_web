<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMatchIndividualCompetitorsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('match_individual_competitors', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('match_id')->unsigned();
            $table->foreign('match_id')->references("id")->on('matches')->onDelete('cascade');
            $table->bigInteger('competitor_id')->unsigned();
            $table->foreign('competitor_id')->references('id')->on('participants')->onDelete('cascade');
            $table->bigInteger("line_id")->unsigned()->nullable();
            $table->foreign('line_id')->references('id')->on('position_event_field')->onDelete('cascade');
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
        Schema::dropIfExists('match_individual_competitors');
    }
}

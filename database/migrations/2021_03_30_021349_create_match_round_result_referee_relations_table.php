<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMatchRoundResultRefereeRelationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('match_round_result_referee_relations', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('match_round_result_id')->unsigned();
            $table->foreign('match_round_result_id', 'round_result')->references('id')->on('match_round_result')->onDelete('cascade');
            $table->bigInteger('match_referee_id')->unsigned()->nullable();
            $table->foreign('match_referee_id')->references('id')->on('match_referee_relations')->onDelete('cascade');
            $table->string('score');
            $table->tinyInteger('status')->nullable();
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
        Schema::dropIfExists('match_round_result_referee_relations');
    }
}

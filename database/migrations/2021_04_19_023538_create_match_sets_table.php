<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMatchSetsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('match_sets', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('match_id')->unsigned();
            $table->foreign('match_id')->references('id')->on('matches')->onDelete('cascade');
            $table->integer('set_no')->nullable();
            $table->time('start_time')->nullable();
            $table->time('end_time')->nullable();
            $table->tinyInteger('status')->nullable();
            $table->tinyInteger('match_event_team_win')->nullable();
            $table->tinyInteger('match_invididual_win')->nullable();
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
        Schema::dropIfExists('match_sets');
    }
}

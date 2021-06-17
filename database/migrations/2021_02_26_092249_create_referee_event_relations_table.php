<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRefereeEventRelationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('referee_event_relations', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('event_id')->unsigned();
            $table->foreign('event_id')->references('id')->on('sport_discipline_events')->onDelete('cascade');
            $table->bigInteger('referee_id')->unsigned();
            $table->foreign('referee_id')->references('id')->on('referees')->onDelete('cascade');
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
        Schema::dropIfExists('referee_event_relations');
    }
}

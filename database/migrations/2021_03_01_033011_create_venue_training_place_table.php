<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateVenueTrainingPlaceTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('venue_training_place', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('venue_id')->unsigned();
            $table->foreign("venue_id")->references("id")->on("competitor_venues")->onDelete("cascade");
            $table->bigInteger('sport_discipline_id')->unsigned();
            $table->foreign("sport_discipline_id")->references("id")->on("sport_disciplines")->onDelete("cascade");
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
        Schema::dropIfExists('venue_training_place');
    }
}

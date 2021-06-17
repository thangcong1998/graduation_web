<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCompetitorVenueEventRelationTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('competitor_venue_event_relation', function (Blueprint $table) {
            $table->id();
            $table->bigInteger("competitor_venue_id")->unsigned();
            $table->foreign("competitor_venue_id")->references("id")->on("competitor_venues")->onDelete("cascade");
            $table->bigInteger("event_id")->unsigned();
            $table->foreign("event_id")->references("id")->on("sport_discipline_events")->onDelete("cascade");
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
        Schema::dropIfExists('competitor_venue_event_relation');
    }
}

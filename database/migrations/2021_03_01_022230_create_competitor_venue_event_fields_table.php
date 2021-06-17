<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCompetitorVenueEventFieldsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('competitor_venue_event_fields', function (Blueprint $table) {
            $table->id();
            $table->bigInteger("competitor_venue_event_id")->unsigned();
            $table->foreign("competitor_venue_event_id")->references("id")->on("competitor_venue_event_relation")->onDelete("cascade");
            $table->string("name");
            $table->text("description");
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
        Schema::dropIfExists('competitor_venue_event_fields');
    }
}

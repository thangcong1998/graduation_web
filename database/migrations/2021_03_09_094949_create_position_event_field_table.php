<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePositionEventFieldTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('position_event_field', function (Blueprint $table) {
            $table->id();
            $table->bigInteger("event_field_id")->unsigned();
            $table->foreign('event_field_id')->references('id')->on('competitor_venue_event_fields')->onDelete("cascade");
            $table->string('name');
            $table->string('english_name');
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
        Schema::dropIfExists('position_event_field');
    }
}

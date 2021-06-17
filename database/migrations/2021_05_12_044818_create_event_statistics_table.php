<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateEventStatisticsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('event_statistics', function (Blueprint $table) {
            $table->id();
            $table->bigInteger("event_id")->unsigned();
            $table->foreign("event_id")->references("id")->on("sport_discipline_events")->onDelete("cascade");
            $table->string("name");
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
        Schema::dropIfExists('event_statistics');
    }
}

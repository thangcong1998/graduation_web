<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMatchesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('matches', function (Blueprint $table) {
            $table->id();
            $table->bigInteger("stage_id")->unsigned();
            $table->foreign("stage_id")->references("id")->on("stages")->onDelete("cascade");
            $table->bigInteger("event_group_id")->unsigned()->nullable();
            $table->foreign("event_group_id")->references("id")->on("event_group")->onDelete("cascade");
            $table->string('name')->nullable();
            $table->date("event_date");
            $table->dateTime("start_time")->nullable();
            $table->dateTime("end_time")->nullable();
            $table->tinyInteger("match_type")->nullable();
            $table->tinyInteger("status")->default(1);
            $table->bigInteger('venue_id')->unsigned()->nullable();
            $table->foreign('venue_id')->references('id')->on('competitor_venues')->onDelete("cascade");
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
        Schema::dropIfExists('matchs');
    }
}

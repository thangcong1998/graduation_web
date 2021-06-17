<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTableEventSets extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('event_sets', function (Blueprint $table) {
            $table->id();
            $table->bigInteger("event_id")->unsigned()->nullable();
            $table->foreign("event_id")->references("id")->on("sport_discipline_events")->onDelete("cascade");
            $table->string('name')->nullable();
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
        Schema::dropIfExists('event_sets');
    }
}

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTableEventDistinguidePlayerMethods extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('event_distinguish_player_methods', function (Blueprint $table) {
            $table->id();
            $table->bigInteger("event_id")->unsigned();
            $table->foreign("event_id")->references("id")->on("sport_discipline_events")->onDelete("cascade");
            $table->tinyInteger("method_id");
            $table->string("rules")->nullable();
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
        Schema::dropIfExists('event_distinguish_player_methods');
    }
}

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateProgressOfMatchTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('progress_of_match', function (Blueprint $table) {
            $table->id();
            $table->bigInteger("match_id")->unsigned();
            $table->foreign("match_id")->references("id")->on("matches")->onDelete("cascade");
            $table->bigInteger("foul_id")->unsigned()->nullable();
            $table->foreign("foul_id")->references("id")->on("fouls")->onDelete("cascade");
            $table->bigInteger("player_id")->unsigned();
            $table->foreign("player_id")->references("id")->on("participants")->onDelete("cascade");
            $table->bigInteger("player_id_out")->unsigned()->nullable();
            $table->foreign("player_id_out")->references("id")->on("participants")->onDelete("cascade");
            $table->time("time");
            $table->tinyInteger("type");
            $table->string("tns")->nullable();
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
        Schema::dropIfExists('progress_of_match');
    }
}

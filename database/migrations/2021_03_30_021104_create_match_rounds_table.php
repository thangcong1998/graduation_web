<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMatchRoundsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('match_rounds', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('match_id')->unsigned();
            $table->foreign('match_id')->references("id")->on('matches')->onDelete('cascade');
            $table->string('name')->nullable();
            $table->time('start_time')->nullable();
            $table->time('end_time')->nullable();
            $table->tinyInteger('status')->nullable();
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
        Schema::dropIfExists('match_rounds');
    }
}

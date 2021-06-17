<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMedalTableTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('medal_table', function (Blueprint $table) {
            $table->id();
            $table->integer('rank_no')->nullable();
            $table->bigInteger('team_id')->unsigned();
            $table->foreign('team_id')->references('id')->on('team')->onDeletet('cascade');
            $table->integer('gold_medal')->nullable();
            $table->integer('silver_medal')->nullable();
            $table->integer('bronze_medal')->nullable();
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
        Schema::dropIfExists('medal_table');
    }
}

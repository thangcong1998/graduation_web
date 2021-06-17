<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateVrsClientsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('vrs_clients', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('ip');
            $table->bigInteger('event_id')->unsigned();
            $table->foreign('event_id')->references('id')->on('sport_discipline_events')->onDelete('cascade');
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
        Schema::dropIfExists('vrs_clients');
    }
}

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateFunctionsRefereeTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('functions_referee', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('english_name');
            $table->bigInteger("event_id")->unsigned();
            $table->foreign('event_id')->references('id')->on('sport_discipline_events')->onDelete('cascade');
            $table->softDeletes();
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
        Schema::dropIfExists('functions_referee');
    }
}

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CompetitorIndividualEventRelations extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        //
        Schema::create('competitor_individual_event_relations', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('event_id')->unsigned();
            $table->bigInteger('participant_id')->unsigned();
            $table->bigInteger('team_id')->unsigned();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *s
     * @return void
     */
    public function down()
    {
        //
        Schema::dropIfExists('competitor_individual_event_relations');
    }
}

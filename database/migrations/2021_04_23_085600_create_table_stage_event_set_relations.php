<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTableStageEventSetRelations extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('stage_event_set_relations', function (Blueprint $table) {
            $table->id();
            $table->bigInteger("event_id")->unsigned()->nullable();
            $table->foreign("event_id")->references("id")->on("sport_discipline_events")->onDelete("cascade");
            $table->bigInteger("stage_id")->unsigned()->nullable();
            $table->foreign("stage_id")->references("id")->on("stages")->onDelete("cascade");
            $table->bigInteger("event_set_id")->unsigned()->nullable();
            $table->foreign("event_set_id")->references("id")->on("event_sets")->onDelete("cascade");
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
        Schema::dropIfExists('stage_event_set_relations');
    }
}

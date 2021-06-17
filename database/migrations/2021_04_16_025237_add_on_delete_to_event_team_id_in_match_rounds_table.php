<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddOnDeleteToEventTeamIdInMatchRoundsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('match_rounds', function (Blueprint $table) {
            $table->dropForeign('match_rounds_event_round_id_foreign');
            $table->foreign('event_round_id')
                ->references('id')->on('event_rounds')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('match_rounds', function (Blueprint $table) {
            //
        });
    }
}

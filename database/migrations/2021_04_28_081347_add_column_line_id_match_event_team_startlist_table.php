<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddColumnLineIdMatchEventTeamStartlistTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('match_event_team_startlist', function (Blueprint $table) {
            $table->bigInteger("line_id")->unsigned()->nullable();
            $table->foreign("line_id")->references("id")->on("position_event_field")->onDelete("cascade");
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('match_event_team_startlist', function (Blueprint $table) {
            //
        });
    }
}

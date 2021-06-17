<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddColumnEventTeamIdTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        //
        Schema::table('progress_of_match', function (Blueprint $table) {
            $table->bigInteger("event_team_id")->unsigned()->nullable();
            $table->foreign("event_team_id")->references("id")->on("event_teams")->onDelete("cascade");
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //
        Schema::table('progress_of_match', function (Blueprint $table) {
            $table->dropForeign("progress_of_match_event_team_id_foreign");
            $table->dropColumn('event_team_id');
        });
    }
}

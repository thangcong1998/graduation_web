<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddColumnMatchInvididualWinOnTableMatchSets extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        //
        Schema::table('match_sets', function (Blueprint $table) {
            $table->dropColumn("match_invididual_win");
            $table->dropColumn("match_event_team_win");
        });
        Schema::table('match_sets', function (Blueprint $table) {
            $table->integer("match_invididual_win")->nullable();
            $table->integer("match_event_team_win")->nullable();
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
        Schema::table('match_sets', function (Blueprint $table) {
            $table->dropColumn("match_invididual_win");
            $table->dropColumn("match_event_team_win");
        });
    }
}

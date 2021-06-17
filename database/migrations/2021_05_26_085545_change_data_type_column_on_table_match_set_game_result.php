<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class ChangeDataTypeColumnOnTableMatchSetGameResult extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        //
        Schema::table('match_set_game_result', function (Blueprint $table) {
            $table->renameColumn('match_invididual_competitor_id', 'match_individual_competitor_id');
        });
        Schema::table('match_set_game_result', function (Blueprint $table) {
            $table->bigInteger('match_event_team_id')->change();
            $table->bigInteger('match_individual_competitor_id')->change();
            $table->bigInteger('competitor_id')->change();
            $table->bigInteger('event_team_id')->change();
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
    }
}

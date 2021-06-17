<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddColumnEventUniformColorId extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('match_event_team_startlist', function (Blueprint $table) {
            $table->bigInteger("event_uniform_color_id")->unsigned()->nullable();
            $table->foreign("event_uniform_color_id")->references("id")->on("event_uniform_colors")->onDelete("cascade");
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
            $table->dropForeign('match_event_team_startlist_event_uniform_color_id_foreign');
        });
        Schema::table('match_event_team_startlist', function (Blueprint $table) {
            $table->dropColumn('event_uniform_color_id');
        });
    }
}

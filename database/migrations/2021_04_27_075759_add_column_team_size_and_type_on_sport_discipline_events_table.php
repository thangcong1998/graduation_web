<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddColumnTeamSizeAndTypeOnSportDisciplineEventsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('sport_discipline_events', function (Blueprint $table) {
            $table->integer('maximum_team_size')->unsigned()->default(1)->nullable();
            $table->tinyInteger('type')->unsigned()->default(1)->nullable();
            $table->integer('max_competitor_count')->default(1)->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('sport_discipline_events', function (Blueprint $table) {
            $table->dropColumn('maximum_team_size');
            $table->dropColumn('type');
            $table->dropColumn('max_competitor_count');
        });
    }
}

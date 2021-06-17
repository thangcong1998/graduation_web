<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddColumnCompetitorOnTableSportDisciplineEvent extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        //
        Schema::table('sport_discipline_events', function (Blueprint $table) {
            $table->integer('competitor')->default(1)->after('uniform_number');
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
        Schema::table('sport_discipline_events', function (Blueprint $table) {
            $table->dropColumn('competitor');
        });
    }
}

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddColumnIsLineOnSportDisciplineEventsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('sport_discipline_events', function (Blueprint $table) {
            $table->tinyInteger('is_line')->nullable()->default(1);
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
            $table->dropColumn('is_line');
        });
    }
}

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddColumnMatchTypeOnEvents extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('sport_discipline_events', function (Blueprint $table) {
            $table->tinyInteger('match_type')->after('competitor');
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
            $table->dropColumn('match_type');
        });
    }
}

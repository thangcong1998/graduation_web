<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddColumnMatchRoundTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('match_rounds', function (Blueprint $table) {
            $table->bigInteger('event_round_id')->unsigned()->nullable();
            $table->foreign('event_round_id')->references('id')->on('event_rounds');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::create('match_rounds', function (Blueprint $table) {
            $table->dropColumn('event_round_id');
        });
    }
}

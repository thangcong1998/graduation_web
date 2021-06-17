<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddFoulInMatchRoundResultRefereeRelations extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('match_round_result_referee_relations', function (Blueprint $table) {
            $table->bigInteger('foul_id')->unsigned()->nullable();
            $table->foreign('foul_id')->references('id')->on('fouls')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('match_round_result_referee_relations', function (Blueprint $table) {
            $table->dropColumn('foul_id');
        });
    }
}

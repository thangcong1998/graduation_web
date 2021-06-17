<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddMatchSetResultIdToMatchSetGameResult extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('match_set_game_result', function (Blueprint $table) {
            //
            $table->bigInteger('match_set_result_id')->unsigned();
            $table->foreign('match_set_result_id')->references('id')->on('match_set_results')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('match_set_game_result', function (Blueprint $table) {
            //
            $table->dropForeign('match_set_game_result_match_set_result_id_foreign');
            $table->dropColumn('match_set_result_id');
        });
    }
}

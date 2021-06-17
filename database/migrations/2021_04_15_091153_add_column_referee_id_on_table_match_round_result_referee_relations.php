<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddColumnRefereeIdOnTableMatchRoundResultRefereeRelations extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        //
        Schema::table('match_round_result_referee_relations', function (Blueprint $table) {
            $table->integer('referee_id')->nullable();
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
        Schema::create('match_round_result_referee_relations', function (Blueprint $table) {
            $table->dropColumn('referee_id');
        });
    }
}

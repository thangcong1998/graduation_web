<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddColumnLoseScoreOnMatchIndividualCompetitors extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        //
        Schema::table('match_individual_competitors', function (Blueprint $table) {
            $table->integer('lose_score')->nullable();
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
        Schema::table('match_individual_competitors', function (Blueprint $table) {
            $table->dropColumn('lose_score');
        });
    }
}

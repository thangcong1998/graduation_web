<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddColumnIntoMatchIndividualCompetitorsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('match_individual_competitors', function (Blueprint $table) {
            $table->integer("rule")->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('match_individual_competitors', function (Blueprint $table) {
            $table->dropColumn('rule');
        });
    }
}

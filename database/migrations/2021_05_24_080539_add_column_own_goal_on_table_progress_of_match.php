<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddColumnOwnGoalOnTableProgressOfMatch extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        //
        Schema::table('progress_of_match', function (Blueprint $table) {
            $table->boolean("own_goal")->nullable();
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
        Schema::table('progress_of_match', function (Blueprint $table) {
            $table->dropColumn("own_goal");
        });
    }
}

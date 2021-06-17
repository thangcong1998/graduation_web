<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddColumnToStage extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('stages', function (Blueprint $table) {
            $table->tinyInteger('stage_type');
            $table->tinyInteger('match_attendant_type');
            $table->tinyInteger('match_score_type');
            $table->tinyInteger('match_turn_num')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('stages', function (Blueprint $table) {
            $table->dropColumn('stage_type');
            $table->dropColumn('match_attendant_type');
            $table->dropColumn('match_score_type');
            $table->dropColumn('match_turn_num');
        });
    }
}

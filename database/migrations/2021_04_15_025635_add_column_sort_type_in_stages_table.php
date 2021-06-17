<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddColumnSortTypeInStagesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('stages', function (Blueprint $table) {
            $table->tinyInteger('sort_type')->nullable();
        });
        Schema::table('match_individual_competitors', function (Blueprint $table) {
            $table->bigInteger('event_group_member_id')->nullable()->unsigned();
        });
        Schema::table('match_event_teams', function (Blueprint $table) {
            $table->bigInteger('event_group_member_id')->nullable()->unsigned();
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
            $table->dropColumn('sort_type');
        });
        Schema::table('match_individual_competitors', function (Blueprint $table) {
            $table->dropColumn('event_group_member_id');
        });
        Schema::table('match_event_teams', function (Blueprint $table) {
            $table->dropColumn('event_group_member_id');
        });
    }
}

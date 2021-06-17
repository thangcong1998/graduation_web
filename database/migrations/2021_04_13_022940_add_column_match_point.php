<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddColumnMatchPoint extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('match_event_teams', function (Blueprint $table) {
            $table->string('match_point')->nullable()->after('is_qualified');
        });
        Schema::table('match_individual_competitors', function (Blueprint $table) {
            $table->string('match_point')->nullable()->after('is_qualified');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('match_event_teams', function (Blueprint $table) {
            $table->dropColumn('match_point');
        });
        Schema::table('match_individual_competitors', function (Blueprint $table) {
            $table->dropColumn('match_point');
        });
    }
}

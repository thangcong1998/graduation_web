<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class AlterColumnOnEventQualificationCompetitorsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        DB::statement("ALTER TABLE `seagame-info`.`event_qualification_competitors`
        CHANGE COLUMN `participant_id` `participant_id` BIGINT(20) UNSIGNED NULL
        ");
        DB::statement("ALTER TABLE `seagame-info`.`event_qualification_competitors`
          CHANGE COLUMN `event_team_id` `event_team_id` BIGINT(20) UNSIGNED NULL
          ");
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //
    }
}

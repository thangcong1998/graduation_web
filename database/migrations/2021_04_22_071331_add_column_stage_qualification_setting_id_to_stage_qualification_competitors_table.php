<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddColumnStageQualificationSettingIdToStageQualificationCompetitorsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('stage_qualification_competitors', function (Blueprint $table) {
            $table->bigInteger('stage_qualification_setting_id')->unsigned()->nullable();
            $table->foreign('stage_qualification_setting_id', 'stage_settings_stage_competitors')->references('id')->on('stage_qualification_settings')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('stage_qualification_competitors', function (Blueprint $table) {
            $table->dropForeign('stage_settings_stage_competitors');
            $table->dropColumn('stage_qualification_setting_id');
        });
    }
}

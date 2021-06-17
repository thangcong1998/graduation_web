<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateStageQualificationSettingsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('stage_qualification_settings', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('stage_id')->unsigned();
            $table->foreign('stage_id')->references('id')->on('stages')->onDelete('cascade');
            $table->tinyInteger('qualification_type');
            $table->bigInteger('qualified_to_stage_id')->unsigned()->nullable();
            $table->foreign('qualified_to_stage_id')->references('id')->on('stages')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('stage_qualification_settings');
    }
}

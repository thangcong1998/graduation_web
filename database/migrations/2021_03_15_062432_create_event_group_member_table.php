<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateEventGroupMemberTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('event_group_member', function (Blueprint $table) {
            $table->id();
            $table->bigInteger("event_group_id")->unsigned();
            $table->foreign("event_group_id")->references("id")->on("event_group")->onDelete("cascade");
            $table->bigInteger("individual_competitor_id")->unsigned()->nullable();
            $table->foreign("individual_competitor_id")->references("id")->on("participants")->onDelete("cascade");
            $table->bigInteger("event_team_id")->unsigned()->nullable();
            $table->foreign("event_team_id")->references("id")->on("event_teams")->onDelete("cascade");
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
        Schema::dropIfExists('event_group_member');
    }
}

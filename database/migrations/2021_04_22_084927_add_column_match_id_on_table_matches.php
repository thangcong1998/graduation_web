<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddColumnMatchIdOnTableMatches extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        //
        Schema::table('stage_qualification_competitors', function (Blueprint $table) {
            $table->bigInteger("match_id")->unsigned()->nullable();
            $table->foreign("match_id")->references("id")->on("matches")->onDelete("cascade");
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
        Schema::table('stage_qualification_competitors', function (Blueprint $table) {
            $table->dropForeign('stage_qualification_competitors_match_id_foreign');
        });
        Schema::table('stage_qualification_competitors', function (Blueprint $table) {
            $table->dropColumn("match_id");
        });
    }
}

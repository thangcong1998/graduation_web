<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class ChangeDataTypeColumnTimeOnTableProgressOfMatch extends Migration
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
            $table->dropColumn("time");
        });
        Schema::table('progress_of_match', function (Blueprint $table) {
            $table->string("time");
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
    }
}

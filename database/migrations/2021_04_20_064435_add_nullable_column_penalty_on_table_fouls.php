<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddNullableColumnPenaltyOnTableFouls extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        //
        Schema::table('fouls', function (Blueprint $table) {
            $table->dropColumn('penalty');
        });
        Schema::table('fouls', function (Blueprint $table) {
            $table->tinyInteger('penalty')->nullable();
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

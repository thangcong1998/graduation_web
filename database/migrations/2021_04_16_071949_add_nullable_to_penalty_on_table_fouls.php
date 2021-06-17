<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddNullableToPenaltyOnTableFouls extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('fouls', function (Blueprint $table) {
            $table->dropColumn('penalty');
        });
        Schema::table('fouls', function (Blueprint $table) {
            $table->integer('penalty')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('fouls', function (Blueprint $table) {
        });
    }
}

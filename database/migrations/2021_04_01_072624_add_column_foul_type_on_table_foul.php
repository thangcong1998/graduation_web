<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddColumnFoulTypeOnTableFoul extends Migration
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
            $table->integer('foul_type');
            $table->bigInteger('penalty');
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
        Schema::table('fouls', function (Blueprint $table) {
            $table->dropColumn('foul_type');
            $table->dropColumn('penalty');
        });
    }
}

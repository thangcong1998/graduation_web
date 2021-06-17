<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddColumnPersonalIdCardUrlOnTableReferee extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        //
        Schema::table('referees', function (Blueprint $table) {
            $table->string('personal_id_card_url')->nullable();
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
        Schema::table('referees', function (Blueprint $table) {
            $table->dropColumn('personal_id_card_url');
        });
    }
}

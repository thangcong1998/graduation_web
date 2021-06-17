<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddColumnIsDecathlonHeptathlon extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('sport_discipline_events', function (Blueprint $table) {
            $table->boolean('is_decathlon_heptathlon')->nullable()->default(false);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('sport_discipline_events', function (Blueprint $table) {
            $table->dropColumn('is_decathlon_heptathlon');
        });
    }
}

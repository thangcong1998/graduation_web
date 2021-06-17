<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCompetitorVenuesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('competitor_venues', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->bigInteger("region")->unsigned();
            $table->foreign("region")->references("id")->on("m_regions")->onDelete("cascade");
            $table->string('address');
            $table->string('latitude');
            $table->string('longtitude');
            $table->text('html');
            $table->tinyInteger('practise_flag')->nullable();
            $table->tinyInteger('competition_flag')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('competitor_venues');
    }
}

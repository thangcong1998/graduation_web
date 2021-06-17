<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSportDisciplineEventsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('sport_discipline_events', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('english_name');
            $table->string('icon')->nullable();
            $table->unsignedBigInteger('sport_discipline_id');
            $table->integer('competitor_male')->default(0);
            $table->integer('competitor_female')->default(0);
            $table->tinyInteger('competition_type')->default(1);
            $table->tinyInteger("uniform")->default(1);
            $table->tinyInteger('has_goalkeeper')->default(1);
            $table->tinyInteger("uniform_number")->nullable();
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
        Schema::dropIfExists('sport_discipline_events');
    }
}

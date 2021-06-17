<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSportDisciplinesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('sport_disciplines', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('english_name');
            $table->string('note')->nullable();
            $table->string('icon')->nullable();
            $table->unsignedBigInteger('sport_id');
            $table->integer("application_form")->default(1);
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
        Schema::dropIfExists('sport_disciplines');
    }
}

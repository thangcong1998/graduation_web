<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateEventGroupTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('event_group', function (Blueprint $table) {
            $table->id();
            $table->bigInteger("stage_id")->unsigned();
            $table->foreign("stage_id")->references("id")->on("stages")->onDelete("cascade");
            $table->string("name");
            $table->string("count");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('event_group');
    }
}

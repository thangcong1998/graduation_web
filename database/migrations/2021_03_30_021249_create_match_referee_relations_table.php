<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMatchRefereeRelationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('match_referee_relations', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('match_id')->unsigned();
            $table->foreign('match_id')->references("id")->on('matches')->onDelete('cascade');
            $table->bigInteger('referee_id')->unsigned();
            $table->foreign('referee_id')->references('id')->on('referees')->onDelete('cascade');
            $table->bigInteger('referee_role_id')->unsigned()->nullable();
            $table->foreign('referee_role_id')->references('id')->on('functions_referee')->onDelete('cascade');
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
        Schema::dropIfExists('match_referee_relations');
    }
}

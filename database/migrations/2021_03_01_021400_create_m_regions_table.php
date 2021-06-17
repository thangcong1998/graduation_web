<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMRegionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('m_regions', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->integer('code')->nullable();
            $table->integer('parent_id')->nullable(true)->unsigned();
            $table->tinyInteger('level');
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
        Schema::dropIfExists('m_regions');
    }
}

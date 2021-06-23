<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTableRecords extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('records', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('event_id');
            $table->unsignedBigInteger('country_id')->nullable();
            $table->foreign('country_id')->references('id')->on('m_countries')->onDelete("cascade");
            $table->tinyInteger('is_graduation')->default(2);
            $table->tinyInteger('is_asiad')->default(1);
            $table->tinyInteger('is_olympic')->default(1);
            $table->string('taker_name')->nullable();
            $table->string('take_place');
            $table->date('take_time');
            $table->integer('result_record')->default(0);
            $table->integer('unit');
            $table->string('description')->nullable();
            $table->unsignedBigInteger('competitor_id')->nullable();
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
        Schema::dropIfExists('records');
    }
}

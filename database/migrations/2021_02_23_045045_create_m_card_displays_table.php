<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMCardDisplaysTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('m_card_displays', function (Blueprint $table) {
            $table->id();
            $table->string('background_url')->nullable();
            $table->string('front_icon_url')->nullable();
            $table->string('back_icon_url')->nullable();
            $table->string('sign_icon_url')->nullable();
            $table->string('sign_text')->nullable();
            $table->string('description_text')->nullable();
            $table->text('condition_text');
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
        Schema::dropIfExists('m_card_displays');
    }
}

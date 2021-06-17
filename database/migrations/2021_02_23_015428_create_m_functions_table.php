<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMFunctionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('m_functions', function (Blueprint $table) {
            $table->id();
            $table->string('name')->nullable();
            $table->string('english_name')->nullable();
            $table->string('code')->nullable();
            $table->bigInteger('organization_id')->unsigned()->nullable();
            $table->foreign('organization_id')->references('id')->on('m_organizations')->onDelete('cascade');
            $table->string('sub_code')->nullable();
            $table->bigInteger('card_template_id')->unsigned()->nullable();
            $table->foreign('card_template_id')->references('id')->on('m_card_templates')->onDelete("cascade");
            $table->tinyInteger('is_staff')->default(1);
            $table->tinyInteger('is_volunteer')->default(1);
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
        Schema::dropIfExists('m_functions');
    }
}

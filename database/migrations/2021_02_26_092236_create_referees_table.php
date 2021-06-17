<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRefereesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('referees', function (Blueprint $table) {
            $table->id();
            $table->string('given_name');
            $table->string('family_name');
            $table->string('passport_no')->nullable();
            $table->date('passport_expire_date')->nullable();
            $table->string('personal_id_card_no')->nullable();
            $table->date('personal_id_card_issue_date')->nullable();
            $table->date('dob')->nullable();
            $table->string('personal_id_card_issue_department')->nullable();
            $table->tinyInteger('sex');
            $table->unsignedBigInteger('country_of_birth_id');
            $table->unsignedBigInteger('nationality_id');
            $table->unsignedBigInteger('sport_id')->nullable();
            $table->unsignedBigInteger('sport_discipline_id')->nullable();
            $table->text("permanent_address")->nullable();
            $table->string('profile_url')->nullable();
            $table->char('accreditation_number', 10)->nullable();
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
        Schema::dropIfExists('referees');
    }
}

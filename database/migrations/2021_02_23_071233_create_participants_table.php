<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateParticipantsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('participants', function (Blueprint $table) {
            $table->id();
            $table->char('card_no', 10)->nullable();
            $table->unsignedBigInteger('card_template_id');
            $table->unsignedBigInteger('organization_id');
            $table->unsignedBigInteger('function_id');
            $table->string('responsible_organization');
            $table->string('given_name');
            $table->string('family_name');
            $table->string('passport_no')->nullable();
            $table->date('passport_expire_date')->nullable();
            $table->string('personal_id_card_no')->nullable();
            $table->date('personal_id_card_issue_date')->nullable();
            $table->string('personal_id_card_issue_department')->nullable();
            $table->tinyInteger('sex');
            $table->string('height');
            $table->string('weight');
            $table->date('dob');
            $table->unsignedBigInteger('country_of_birth_id');
            $table->unsignedBigInteger('nationality_id');
            $table->unsignedBigInteger('team_id');
            $table->text("permanent_address")->nullable();
            $table->tinyInteger('approval_status');
            $table->string('profile_url')->nullable();
            $table->string('personal_id_card_url')->nullable();
            $table->string('file_scan')->nullable();
            $table->unsignedBigInteger('sport_id')->nullable();
            $table->unsignedBigInteger('sport_discipline_id')->nullable();
            $table->tinyInteger('printed_status')->default(1);
            $table->tinyInteger('received_status')->default(1);
            $table->string('personal_card')->nullable();
            $table->char('accreditation_number', 10)->nullable();
            $table->string('doping_url')->nullable();
            $table->tinyInteger('is_competitor')->default(1);
            $table->tinyInteger('is_referee')->default(1);
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
        Schema::dropIfExists('participants');
    }
}

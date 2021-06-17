<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StageQualificationSetting extends Model
{
    protected $table = "stage_qualification_settings";
    protected $fillable = ['stage_id', 'qualification_type', 'qualified_to_stage_id'];
}

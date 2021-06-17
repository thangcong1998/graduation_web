<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class QualificationSetting extends Model
{
    protected $table = "stage_qualification_settings";
    protected $fillable = ['stage_id', 'qualification_type', 'qualified_to_stage_id'];

    const qualification_type = [
        'qualified' => 1,
        'hcv' => 2,
        'hcb' => 3,
        'hcd' => 4
    ];

    public function qualified_to_stage()
    {
        return $this->belongsTo(Stage::class, 'qualified_to_stage_id', 'id');
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StageSubCriteriasRelation extends Model
{
    protected $table = "stage_sub_criterias_relations";
    protected $fillable = [
        "event_id", "stage_id", "sub_criteria_id", "event_team_id", "competitor_id", "total_value"
    ];
}

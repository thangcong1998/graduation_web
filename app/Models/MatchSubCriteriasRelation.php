<?php

namespace App\Models;

use Awobaz\Compoships\Compoships;
use Illuminate\Database\Eloquent\Model;

class MatchSubCriteriasRelation extends Model
{
    use Compoships;
    protected $table = "match_sub_criterias_relations";
    protected $fillable = [
        "event_id", "match_id", "stage_id", "sub_criteria_id", "event_team_id", "competitor_id", "value"
    ];
}

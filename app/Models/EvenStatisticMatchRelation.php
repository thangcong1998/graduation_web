<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EvenStatisticMatchRelation extends Model
{
    //
    public $table = "event_statistics_match_relations";
    public $fillable = [
        'event_statistic_id', 'competitor_id', 'event_team_id', 'match_id', 'value'
    ];

    public function event_team()
    {
        return $this->belongsTo(EventTeam::class, "event_team_id", "id");
    }
    public function event_statistic()
    {
        return $this->belongsTo(EventStatistic::class, "event_statistic_id", "id");
    }
    public function competitor()
    {
        return $this->belongsTo(Participant::class, "competitor_id", "id");
    }
}

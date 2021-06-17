<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StageQualificationCompetitor extends Model
{
    protected $table = 'stage_qualification_competitors';
    protected $fillable = [
        'stage_id', 'qualification_type', 'qualified_to_stage_id',
        'competitor_individual_event_relation_id', 'participant_id', 'event_team_id', 'team_id',
        'match_id'
    ];

    const qualification_type = [
        'qualified' => 1,
        'hcv' => 2,
        'hcb' => 3,
        'hcd' => 4
    ];
    public function competitor()
    {
        return $this->belongsTo(Participant::class, 'participant_id', 'id');
    }

    public function event_team()
    {
        return $this->belongsTo(EventTeam::class, 'event_team_id', 'id');
    }
    public function team()
    {
        return $this->belongsTo(Team::class, 'team_id', 'id');
    }
    public function stage()
    {
        return $this->belongsTo(Stage::class, 'stage_id', 'id');
    }
}

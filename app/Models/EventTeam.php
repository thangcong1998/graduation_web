<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EventTeam extends Model
{
    protected $table = 'event_teams';
    protected $fillable = [
        'name', 'team_id', 'event_id', 'code'
    ];
    protected $with = ['team'];

    public function Team()
    {
        return $this->belongsTo(Team::class, "team_id", 'id');
    }

    public function Event()
    {
        return $this->belongsTo(SportDisciplineEvent::class, 'event_id', 'id');
    }

    public function EventTeamCompetitor()
    {
        return $this->hasMany(EventTeamCompetitor::class, 'event_team_id', 'id');
    }

    public function event_team_competitor()
    {
        return $this->belongsToMany(Participant::class, 'event_team_competitors', 'event_team_id', 'competitor_id');
    }

    public function match_event_teams()
    {
        return $this->belongsTo(MatchEventTeam::class, 'id', 'event_team_id');
    }

    public function stage_qualification_competitors()
    {
        return $this->hasMany(StageQualificationCompetitor::class, "event_team_id", "id");
    }

    public function uniforms()
    {
        return $this->hasMany(EventUniformColors::class, 'event_team_id', 'id');
    }

    public function event_qualification_competitors()
    {
        return $this->hasMany(EventQualificationCompetitor::class, "event_team_id", "id");
    }
}

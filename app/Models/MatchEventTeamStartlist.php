<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MatchEventTeamStartlist extends Model
{
    protected $table = "match_event_team_startlist";

    public $fillable = ['match_event_team_id', 'event_team_id', 'competitor_id', 'line_id', 'event_uniform_color_id'];

    public function match_event_team()
    {
        return $this->belongsTo(MatchEventTeam::class, 'match_event_team_id', 'id');
    }

    public function event_team()
    {
        return $this->belongsTo(EventTeam::class, 'event_team_id', 'id');
    }

    public function competitor()
    {
        return $this->belongsTo(Participant::class, 'competitor_id', 'id');
    }
    public function uniforms()
    {
        return $this->belongsTo(EventUniformColors::class, 'event_uniform_color_id', 'id');
    }
}

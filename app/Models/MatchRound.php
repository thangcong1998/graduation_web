<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MatchRound extends Model
{
    protected $table = 'match_rounds';

    protected $fillable = ['match_id', 'event_round_id', 'start_time', 'end_time', 'status', 'name', 
    'competitor_id', 'event_team_id'];

    public function match()
    {
        return $this->belongsTo(Match::class, 'match_id', 'id');
    }

    public function result()
    {
        return $this->hasMany(MatchRoundResult::class, 'match_round_id', 'id');
    }

    public function event_round()
    {
        return $this->belongsTo(EventRounds::class, 'event_round_id', 'id');
    }

    public function competitor()
    {
        return $this->belongsTo(Participant::class, 'competitor_id', 'id');
    }

    public function event_team()
    {
        return $this->belongsTo(EventTeam::class, 'event_team_id', 'id');
    }
}

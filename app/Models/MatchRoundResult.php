<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MatchRoundResult extends Model
{
    protected $table = 'match_round_result';

    protected $fillable = [
        'match_round_id', 'match_individual_competitor_id', 'match_event_team_id',
        'score', 'competitor_id', 'event_team_id', 'match_id', 'is_ko', 'turn'
    ];

    public function match_round()
    {
        return $this->belongsTo(MatchRound::class, 'match_round_id', 'id');
    }

    public function match_individual_competitor()
    {
        return $this->belongsTo(MatchIndividualCompetitor::class, 'match_individual_competitor_id', 'id');
    }

    public function match_event_team()
    {
        return $this->belongsTo(MatchEventTeam::class, 'match_event_team_id', 'id');
    }

    public function match_round_result_referee_relation()
    {
        return $this->hasMany(MatchRoundResultRefereeRelation::class, 'match_round_result_id', 'id');
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

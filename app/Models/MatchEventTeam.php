<?php

namespace App\Models;

use Awobaz\Compoships\Compoships;
use Illuminate\Database\Eloquent\Model;

class MatchEventTeam extends Model
{
    use Compoships;
    protected $table = "match_event_teams";
    protected $fillable = ['match_id', 'event_team_id', 'final_score', 'is_winner', 'qualified', 'match_point', 'event_group_member_id','lose_score'];

    const is_winner = [
        'WIN' => 1,
        'LOSE' => 2,
        'DRAW' => 3
    ];

    public function eventTeam()
    {
        return $this->belongsTo(EventTeam::class, 'event_team_id', 'id');
    }

    public function event_team()
    {
        return $this->belongsTo(EventTeam::class, 'event_team_id', 'id');
    }

    public function match()
    {
        return $this->belongsTo(Match::class, 'match_id', 'id');
    }
    
    public function member()
    {
        return $this->hasMany(MatchEventTeamStartlist::class, 'match_event_team_id', 'id');
    }

    public function result()
    {
        return $this->hasMany(MatchRoundResult::class, 'match_event_team_id', 'id');
    }
    public function event_group_member()
    {
        return $this->belongsTo(EventGroupMember::class, 'event_group_member_id', 'id');
    }
    public function match_sub_criterias_relations()
    {
        return $this->hasMany(MatchSubCriteriasRelation::class, ['match_id', "event_team_id"], ["match_id", "event_team_id"]);
    }
}

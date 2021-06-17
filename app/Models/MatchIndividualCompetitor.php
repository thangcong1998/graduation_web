<?php

namespace App\Models;

use Awobaz\Compoships\Compoships;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MatchIndividualCompetitor extends Model
{
    use Compoships;
    protected $table = "match_individual_competitors";
    protected $fillable = ['match_id', 'competitor_id', 'line_id', 'final_score', 'is_winner', 'qualified', 'line_id', 'match_point', 'event_group_member_id', 'rule','is_ko','lose_score'];

    const is_winner = [
        'WIN' => 1,
        'LOSE' => 2,
        'DRAW'=> 3
    ];

    public function competitor()
    {
        return $this->belongsTo(Participant::class, 'competitor_id', 'id');
    }

    public function line()
    {
        return $this->belongsTo(PositionEventField::class, 'line_id', 'id');
    }

    public function match()
    {
        return $this->belongsTo(Match::class, 'match_id', 'id');
    }

    public function result()
    {
        return $this->hasMany(MatchRoundResult::class, 'match_individual_competitor_id', 'id');
    }
    public function match_sub_criterias_relations()
    {
        return $this->hasMany(MatchSubCriteriasRelation::class, ['match_id', "competitor_id"], ["match_id", "competitor_id"]);
    }
}

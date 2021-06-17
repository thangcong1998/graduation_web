<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MatchRoundResultRefereeRelation extends Model
{
    protected $table = 'match_round_result_referee_relations';

    protected $fillable = [
        'match_round_result_id', 'match_referee_id',
        'score', 'status', 'foul_id', 'referee_id'
    ];

    public function match_round_result()
    {
        return $this->belongsTo(MatchRoundResult::class, 'match_round_result_id', 'id');
    }
    public function referee()
    {
        return $this->belongsTo(Referee::class, 'referee_id', 'id');
    }
    public function foul()
    {
        return $this->belongsTo(Foul::class, 'foul_id', 'id');
    }
}

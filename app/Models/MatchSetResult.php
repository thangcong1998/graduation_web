<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MatchSetResult extends Model
{
    //
    protected $table = 'match_set_results';

    protected $fillable = [
        'match_set_id', 'score', 'match_event_team_id', 'match_individual_competitor_id',
        'competitor_id', 'set_point',
        'event_team_id',
    ];

    public function match_set_game_result()
    {
        return $this->hasMany(MatchSetGameResult::class, 'match_set_result_id', 'id');
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MatchSetGameResult extends Model
{
    //
    protected $table = 'match_set_game_result';

    protected $fillable = [
        'match_set_id', 'set_game_no', 'match_individual_competitor_id',
        'match_event_team_id', 'score',
        'competitor_id', 'event_team_id', 'match_set_result_id'
    ];
}

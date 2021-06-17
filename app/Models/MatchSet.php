<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MatchSet extends Model
{
    //
    protected $table = 'match_sets';

    protected $fillable = [
        'match_id', 'set_no', 'start_time', 'end_time', 'status',
        'match_event_team_win', 'match_invididual_win', 'event_set_id'
    ];

    public function match_set_game_result()
    {
        return $this->hasMany(MatchSetGameResult::class, 'match_set_id', 'id');
    }
    public function match_set_result()
    {
        return $this->hasMany(MatchSetResult::class, 'match_set_id', 'id');
    }
}

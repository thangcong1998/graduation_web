<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EventUniformColors extends Model
{
    protected $table = "event_uniform_colors";
    protected $fillable = [
        'team_id', 'event_team_id', 'event_id', 'no', 'player_shirt', 'player_shorts', 'player_socks', 'goalkeeper_shirt',
        'goalkeeper_shorts', 'goalkeeper_socks'
    ];

    public function team()
    {
        return $this->belongsTo(Team::class, 'team_id', 'id');
    }

    public function event()
    {
        return $this->belongsTo(SportDisciplineEvent::class, 'sport_disicipline_event_id', 'id');
    }
}

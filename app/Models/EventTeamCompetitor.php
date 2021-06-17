<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EventTeamCompetitor extends Model
{
    protected $table = 'event_team_competitors';
    protected $fillable = [
        'event_team_id', 'competitor_id'
    ];

    public function EventTeam() {
        return $this->belongsTo(EventTeam::class, 'event_team_id', 'id');
    }

    public function Competitor() {
        return $this->belongsTo(Participant::class, 'competitor_id', 'id');
    }
}

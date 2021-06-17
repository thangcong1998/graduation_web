<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EventQualificationCompetitor extends Model
{
    protected $table = "event_qualification_competitors";
    protected $fillable = ['event_id', 'participant_id', 'event_team_id', 'team_id', 'qualification_type'];

    const qualification_type = [
        'qualified' => 1,
        'hcv' => 2,
        'hcb' => 3,
        'hcd' => 4
    ];
    public function team()
    {
        return $this->belongsTo(Team::class, 'team_id', 'id');
    }
}

<?php

namespace App\Models;

use App\Models\Participant;
use App\Models\SportDisciplineEvent;
use Illuminate\Database\Eloquent\Model;

class CompetitorIndividualEventRelations extends Model
{
    //
    protected $table = "competitor_individual_event_relations";
    protected $fillable = ["event_id", "participant_id", "team_id"];

    public function participant()
    {
        return $this->belongsTo(Participant::class, "participant_id", 'id');
    }

    public function event()
    {
        return $this->belongsTo(SportDisciplineEvent::class, "event_id", 'id');
    }
}

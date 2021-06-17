<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EventGroupMember extends Model
{
    protected $table = "event_group_member";
    protected $fillable = ['event_group_id', 'individual_competitor_id', 'event_team_id'];

    public function event()
    {
        return $this->belongsTo(EventGroup::class, 'event_group_id', 'id');
    }

    public function participant()
    {
        return $this->belongsTo(Participant::class, 'individual_competitor_id', 'id');
    }

    public function event_team()
    {
        return $this->belongsTo(EventTeam::class, 'event_team_id', 'id');
    }

    public function stage_sub_criterias_relations()
    {
        return $this->hasMany(StageSubCriteriasRelation::class, 'event_team_id', 'event_team_id');
    }
}

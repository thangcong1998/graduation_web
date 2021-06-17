<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EventGroup extends Model
{
    protected $table = "event_group";
    protected $fillable = ['stage_id', 'name', 'count'];

    public function stage()
    {
        return $this->belongsTo(Stage::class, 'stage_id', 'id');
    }
    public function group_members()
    {
        return $this->hasMany(EventGroupMember::class, 'event_group_id', 'id');
    }
    public function matches()
    {
      return $this->hasMany(Match::class, 'event_group_id', 'id');
    }
    
}

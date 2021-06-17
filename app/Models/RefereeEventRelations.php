<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RefereeEventRelations extends Model
{
    protected $table = 'referee_event_relations';
    protected $fillable = [
        'referee_id', 'event_id'
    ];

    public function event()
    {
        return $this->belongsTo(SportDisciplineEvent::class, 'event_id', 'id');
    }
}

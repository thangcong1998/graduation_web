<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CompetitorVenueEventRelation extends Model
{
    protected $table = 'competitor_venue_event_relation';
    protected $fillable = [
        'competitor_venue_id', 'event_id'
    ];
    public function event_field()
    {
        return $this->hasMany(CompetitorVenueEventField::class, 'competitor_venue_event_id', 'id');
    }
    public function event()
    {
        return $this->belongsTo(SportDisciplineEvent::class, 'event_id', 'id');
    }
    public function venue()
    {
        return $this->belongsTo(CompetitorVenue::class, 'competitor_venue_id', 'id');
    }
}

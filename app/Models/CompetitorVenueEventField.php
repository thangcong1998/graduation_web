<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CompetitorVenueEventField extends Model
{
    protected $table = 'competitor_venue_event_fields';
    protected $fillable = [
        'competitor_venue_event_id', 'name', 'description', 'english_name'
    ];
    public function position_field()
    {
        return $this->hasMany(PositionEventField::class, 'event_field_id', 'id');
    }
}

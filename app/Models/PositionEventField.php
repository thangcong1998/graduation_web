<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PositionEventField extends Model
{
    protected $table = 'position_event_field';
    protected $fillable = [
        'name', 'english_name', 'event_field_id'
    ];

    public function event_field()
    {
        return $this->belongsTo(CompetitorVenueEventField::class, 'event_field_id', 'id');
    }
}

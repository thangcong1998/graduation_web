<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;


class EventDistinguishPlayerMethod extends Model
{
    protected $table = 'event_distinguish_player_methods';
    protected $fillable = [
        'event_id', 'method_id', 'rules'
    ];

    const method_id = [
        'uniform' => 1,
        'peep' => 2,
        'custom' => 3,
        'no_need' => null
    ];

    public function event()
    {
        return $this->belongsTo(SportDisciplineEvent::class, 'event_id', 'id');
    }
}

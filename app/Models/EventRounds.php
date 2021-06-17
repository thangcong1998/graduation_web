<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EventRounds extends Model
{
    //
    protected $table = 'event_rounds';
    protected $fillable = [
        'name', 'event_id', 'is_winner_classification_round'
    ];
}

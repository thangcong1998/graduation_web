<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EventSet extends Model
{
    //
    public $table = "event_sets";
    public $fillable = [
        'name', 'event_id'
    ];
}

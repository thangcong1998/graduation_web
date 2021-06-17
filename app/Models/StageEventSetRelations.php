<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StageEventSetRelations extends Model
{
    //
    protected $table = "stage_event_set_relations";
    protected $fillable = ['event_id', 'name', 'stage_id'];
}

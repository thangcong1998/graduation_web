<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StageMatchPoint extends Model
{
    protected $table = 'stage_match_points';
    protected $fillable = ['stage_id', 'point_name', 'points'];
}

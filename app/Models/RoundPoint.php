<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RoundPoint extends Model
{
    protected $table = "round_points";
    protected $fillable = ['stage_id', 'point_name', 'points'];
}

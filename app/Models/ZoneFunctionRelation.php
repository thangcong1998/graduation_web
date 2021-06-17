<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ZoneFunctionRelation extends Model
{
    protected $table = 'function_access_zone_relations';
    protected $fillable = [
        'access_zone_id', 'function_id'
    ];
}

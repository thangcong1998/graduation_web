<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AreaFunctionRelation extends Model
{
    protected $table = 'function_access_area_relations';
    protected $fillable = [
        'access_area_id', 'function_id'
    ];
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VehicleFunctionRelation extends Model
{
    protected $table = 'function_access_vehicle_relations';
    protected $fillable = [
        'access_vehicle_id', 'function_id'
    ];
}

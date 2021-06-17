<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Vehicle extends Model
{
    use SoftDeletes;
    protected $table = 'm_access_vehicles';
    protected $fillable = [
        'name', 'icon_url'
    ];

    public function function_relations()
    {
        return $this->belongsToMany(Functions::class, 'function_access_vehicle_relations', 'access_vehicle_id','function_id');
    }
}

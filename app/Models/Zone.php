<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Zone extends Model
{
    use SoftDeletes;
    protected $table = 'm_access_zones';
    protected $fillable = [
        'name', 'icon_url'
    ];

    public function function_relations()
    {
        return $this->belongsToMany(Functions::class, 'function_access_zone_relations', 'access_zone_id','function_id');
    }
}

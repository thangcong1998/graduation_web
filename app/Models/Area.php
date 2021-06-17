<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use OwenIt\Auditing\Contracts\Auditable;

class Area extends Model
{

    use SoftDeletes;
    protected $table = 'm_access_areas';
    protected $fillable = [
        'name', 'icon_url'
    ];

    public function function_relations()
    {
        return $this->belongsToMany(Functions::class, 'function_access_area_relations', 'access_area_id', 'function_id');
    }
}

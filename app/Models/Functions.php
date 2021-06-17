<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Functions extends Model
{
    use SoftDeletes;
    protected $table = 'm_functions';
    protected $fillable = [
        'name', 'english_name', 'code', 'organization_id', 'sub_code', 'card_template_id', 'is_staff', 'is_volunteer'
    ];
    protected $with = ['Organization'];

    public function Organization()
    {
        return $this->belongsTo(Organization::class,'organization_id','id');
    }

    public function CardTemplate()
    {
        return $this->belongsTo(CardTemplate::class, 'card_template_id', 'id');
    }
    public function area_relation()
    {
        return $this->belongsToMany(Area::class, 'function_access_area_relations', 'function_id', 'access_area_id');
    }

    public function zone_relation()
    {
        return $this->belongsToMany(Zone::class, 'function_access_zone_relations', 'function_id', 'access_zone_id');
    }

    public function vehicle_relation()
    {
        return $this->belongsToMany(Vehicle::class, 'function_access_vehicle_relations', 'function_id', 'access_vehicle_id');
    }
}

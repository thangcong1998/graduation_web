<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use OwenIt\Auditing\Contracts\Auditable;

class Regions extends Model implements Auditable
{
    use \OwenIt\Auditing\Auditable;
    use SoftDeletes;
    protected $table = 'm_regions';
    protected $fillable = [
        'name', 'code', 'parent_id', 'level'
    ];
    public function parent()
    {
        return $this->belongsTo(Regions::class, 'parent_id', 'id');
    }
    const level = [
        'province' => 1,
        'districts' => 2,
        'wards' => 3
    ];
    public function venues()
    {
        return $this->hasMany(CompetitorVenue::class, 'region', 'id');
    }
}

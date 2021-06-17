<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Organization extends Model
{
    use SoftDeletes;
    protected $table = 'm_organizations';
    protected $fillable = [
        'name', 'english_name', 'abbreviation', 'is_holder'
    ];
    public function functions(){
        return $this->hasMany(Functions::class,'organization_id','id');
    }
}

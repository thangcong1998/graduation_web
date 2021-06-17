<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Module extends Model
{
    //
    protected $table = 'modules';
    protected $fillable = [
        'name',
        'display_name',
        'group'
    ];
    public function permissions()
    {
        return $this->hasMany('Spatie\Permission\Models\Permission', 'module_id');
    }
}

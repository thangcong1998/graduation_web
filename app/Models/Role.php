<?php

namespace App\Models;

use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Permission\Models\Role as BaseRole;
use App\Models\Module;
use OwenIt\Auditing\Contracts\Auditable;

class Role extends BaseRole
{
    // use \OwenIt\Auditing\Auditable;
    use SoftDeletes;
    protected $fillable = [
        'name', 'display_name', 'guard_name', 'created_at', 'updated_at'
    ];

    public function modules()
    {
        return $this->belongsToMany(Module::class, 'role_has_modules');
    }
}

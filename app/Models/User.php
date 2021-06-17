<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Passport\HasApiTokens;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Permission\Traits\HasRoles;
use OwenIt\Auditing\Auditable;

class User extends Authenticatable implements \OwenIt\Auditing\Contracts\Auditable
{

    use  HasApiTokens, HasRoles, SoftDeletes, Notifiable, Auditable;
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $table = 'users';
    protected $fillable = [
        'name', 'email', 'password', 'user_name', 'phone', 'role_id'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    public const user_type = [
        'admin' => 1,
        'user' => 2,
    ];

    protected $hidden = [
        'password', 'remember_token',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    protected $guard_name = 'api';

    public function role()
    {
        return $this->belongsTo(Role::class, 'role_id', 'id');
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Card extends Model
{
    protected $table = 'cards';
    protected $fillable = [
        'card_no', 'is_active', 'ref_type', 'ref_id', 'active_at', 'user_id'
    ];
    const is_active = [
        'in_active' => 1,
        'active' => 2,
        'invalid' => 3,
    ];
    protected $with = ['user'];

    const ref_type = [
        'participant' => 'App\\Models\\Participant',
        'staff' => 'App\\Models\\Staff',
        'volunteer' => 'App\\Models\\Volunteer'
    ];

    public function ref()
    {
        return $this->morphTo();
    }
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }
    public function functions()
    {
        return $this->belongsTo(Functions::class, 'function_id', 'id');
    }
}

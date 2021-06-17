<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SubCriteria extends Model
{
    protected $table = 'sub_criterias';
    protected $fillable = [
        'event_id', 'type', 'priority_order', 'name'
    ];

    const type = [
        'win_match' => 1,
        'score' => 2,
        'difference' => 3,
        'goal' => 4,
        'other' => 5
    ];
}

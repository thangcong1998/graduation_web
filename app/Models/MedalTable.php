<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MedalTable extends Model
{
    //
    protected $table = "medal_table";
    protected $fillable = [
        'rank_no', 'team_id', 'gold_medal', 'silver_medal', 'bronze_medal'
    ];

    public function team()
    {
        return $this->belongsTo(Team::class, 'team_id', 'id');
    }
}

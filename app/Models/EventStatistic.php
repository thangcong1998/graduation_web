<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EventStatistic extends Model
{
    //
    public $table = "event_statistics";
    public $fillable = [
        'name', 'event_id'
    ];

    public function event_statistics_match_relations()
    {
        return $this->hasMany(EvenStatisticMatchRelation::class, "event_statistic_id", "id");
    }
}

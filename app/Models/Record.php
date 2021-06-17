<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use OwenIt\Auditing\Contracts\Auditable;

class Record extends Model implements Auditable
{
    use \OwenIt\Auditing\Auditable;
    use SoftDeletes;
    protected $table = 'records';
    protected $fillable = [
        'event_id', 'country_id', 'is_seagame','is_seagame_31', 'is_asiad', 'is_olympic', 'taker_name',
        'take_place', 'take_time', 'result_record', 'unit', 'description', 'competitor_id', 'result_record_time'
    ];

    public function country()
    {
        return $this->belongsTo(Country::class,  'country_id', 'id');
    }
    public function event()
    {
        return $this->belongsTo(SportDisciplineEvent::class, 'event_id', 'id');
    }
    public function competitor()
    {
        return $this->belongsTo(Participant::class, 'competitor_id', 'id');
    }

    public const unit = [
        'hour' => 1,
        'minute' => 2,
        'seconds' => 3,
        'kilometer' => 4,
        'meter' => 5,
        'centimeter' => 6,
        'match' => 7,
        'goal' => 8,
        'time' => 11,
    ];
}

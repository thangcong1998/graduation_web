<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use OwenIt\Auditing\Contracts\Auditable;

class Foul extends Model implements Auditable
{
    use \OwenIt\Auditing\Auditable;
    use SoftDeletes;
    protected $table = 'fouls';
    protected $fillable = [
        'event_id', 'name', 'english_name', 'foul_type', 'penalty'
    ];

    public function event()
    {
        return $this->belongsTo(SportDisciplineEvent::class, 'event_id', 'id');
    }
}

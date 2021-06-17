<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use OwenIt\Auditing\Contracts\Auditable;

class SportDiscipline extends Model implements Auditable
{
    use \OwenIt\Auditing\Auditable;
    use SoftDeletes;
    public $table = "sport_disciplines";
    public $fillable = [
        'name', 'english_name', 'sport_id', 'icon', 'note', 'application_form'
    ];

    public function sport()
    {
        return $this->belongsTo(Sport::class, 'sport_id', 'id');
    }

    public function sportDisciplineEvents()
    {
        return $this->hasMany(SportDisciplineEvent::class, 'sport_discipline_id', 'id');
    }
    public function files()
    {
        return $this->morphMany(Files::class, 'ref');
    }
}

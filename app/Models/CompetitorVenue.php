<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use OwenIt\Auditing\Contracts\Auditable;

class CompetitorVenue extends Model implements Auditable
{
    use \OwenIt\Auditing\Auditable;
    use SoftDeletes;
    protected $table = 'competitor_venues';
    protected $fillable = [
        'name', 'region', 'address', 'latitude', 'longtitude', 'html', 'practise_flag', 'competition_flag', 'code'
    ];

    public function files()
    {
        return $this->morphMany(Files::class, 'ref');
    }
    public function venue_training_place()
    {
        return $this->belongsToMany(SportDiscipline::class, 'venue_training_place', 'venue_id', 'sport_discipline_id');
    }
    public function region()
    {
        return $this->belongsTo(Regions::class, 'region', 'id');
    }
    public function venue_competition_place()
    {
        return $this->belongsToMany(SportDiscipline::class, 'venue_competition_place', 'venue_id', 'sport_discipline_id');
    }
    public function venue_relation()
    {
        return $this->hasMany(CompetitorVenueEventRelation::class, 'competitor_venue_id', 'id');
    }
}

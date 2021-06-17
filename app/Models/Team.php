<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use OwenIt\Auditing\Contracts\Auditable;

class Team extends Model implements Auditable
{
    use \OwenIt\Auditing\Auditable;
    use SoftDeletes;
    protected $table = 'team';
    protected $fillable = [
        'name', 'english_name', 'is_sport_team', 'country_id'
    ];
    protected $with = 'Country';
    const is_sport_team = [
        'none_sport_team' => 1,
        'is_sport_team' => 2
    ];

    public function Country()
    {
        return $this->belongsTo(Country::class, 'country_id', 'id');
    }

    public function participant_list()
    {
        return $this->hasMany(Participant::class, 'team_id', 'id');
    }
    public function event_team()
    {
        return $this->hasMany(EventTeam::class, 'team_id', 'id');
    }
    public function medal()
    {
        return $this->hasOne(MedalTable::class, 'team_id', 'id');
    }
    public function competitor_individual_event()
    {
        return $this->hasMany(CompetitorIndividualEventRelations::class, 'team_id', 'id');
    }
    public function uniform_color()
    {
        return $this->hasMany(EventUniformColors::class, 'team_id', 'id');
    }
    public function participant_event()
    {
        return $this->hasMany(CompetitorIndividualEventRelations::class, 'team_id', 'id');
    }

}

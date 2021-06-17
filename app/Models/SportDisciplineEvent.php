<?php

namespace App\Models;

use App\Http\Requests\RefereeStoreRequest;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use OwenIt\Auditing\Contracts\Auditable;

class SportDisciplineEvent extends Model implements Auditable
{
  use \OwenIt\Auditing\Auditable;
  use SoftDeletes;
  public $table = "sport_discipline_events";
  public $fillable = [
    'name', 'english_name', 'sport_discipline_id', 'icon', 'is_line', 'round_type',
    'competitor_male', 'competitor_female', 'competition_type', 'uniform', 'has_goalkeeper', 'competitor', 'match_type',
    'maximum_team_size', 'type', 'max_competitor_count', 'is_decathlon_heptathlon'
  ];

  public const competition_type = [
    'INDIVIDUAL' => 1,
    'TEAM' => 2
  ];

  public const match_type = [
    '1vs1' => 1,
    '1vsn' => 2
  ];

  public const type = [
    'MEN_EVENT' => 1,
    'WOMEN_EVENT' => 2,
    'MIX_EVENT' => 3
  ];

  public const is_line = [
    'NO_LINE' => 1,
    'HAS_LINE' => 2,
  ];

  public function sportDiscipline()
  {
    return $this->belongsTo(SportDiscipline::class, 'sport_discipline_id', 'id');
  }

  public function teams()
  {
    return $this->belongsToMany(Team::class, "event_teams", "event_id", "team_id");
  }
  public function participant()
  {
    return $this->belongsToMany(Participant::class, "competitor_individual_event_relations", "event_id", "participant_id");
  }
  public function files()
  {
    return $this->morphMany(Files::class, 'ref');
  }
  public function venue()
  {
    return $this->belongsToMany(CompetitorVenue::class, 'competitor_venue_event_relation', 'event_id', 'competitor_venue_id');
  }
  public function function_referee()
  {
    return $this->hasMany(FunctionsReferee::class, 'event_id', 'id');
  }
  public function competitor_event()
  {
    return $this->hasMany(CompetitorIndividualEventRelations::class, 'event_id', 'id');
  }
  public function referee()
  {
    return $this->belongsToMany(Referee::class, 'referee_event_relations', 'event_id', 'referee_id');
  }
  public function eventTeam()
  {
    return $this->hasMany(EventTeam::class, 'event_id', 'id');
  }

  public function venues()
  {
    return $this->hasMany(CompetitorVenueEventRelation::class, 'event_id', 'id');
  }

  public function event_rounds()
  {
    return $this->hasMany(EventRounds::class, 'event_id', 'id');
  }
  public function stages()
  {
    return $this->hasMany(Stage::class, 'event_id', 'id');
  }
  public function event_set()
  {
    return $this->hasMany(EventSet::class, 'event_id', 'id');
  }
  public function event_distinguish_player_method()
  {
    return $this->hasOne(EventDistinguishPlayerMethod::class, 'event_id', 'id');
  }
  public function fouls()
  {
    return $this->hasMany(Foul::class, 'event_id', 'id');
  }
  public function sub_criterias()
  {
    return $this->hasMany(SubCriteria::class, "event_id", "id");
  }
  public function event_statistic()
  {
    return $this->hasMany(EventStatistic::class, 'event_id', 'id');
  }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use OwenIt\Auditing\Contracts\Auditable;
use Illuminate\Database\Eloquent\SoftDeletes;

class Match extends Model implements Auditable
{
    use SoftDeletes,\OwenIt\Auditing\Auditable;
   
    protected $table = 'matches';
    protected $fillable = ['stage_id', 'event_group_id', 'name', 'event_date', 'second_date',
    'start_time', 'end_time', 'status', 'venue_id', 'venue_event_field_id', 'code'];

    protected static function boot() {
        parent::boot();
    
        static::deleted(function ($match) {
          $match->match_individual_competitors()->delete();
          $match->match_event_teams()->delete();
        });
    }

    public function stage()
    {
        return $this->belongsTo(Stage::class, 'stage_id', 'id');
    }
    public function event_group()
    {
        return $this->belongsTo(EventGroup::class, 'event_group_id', 'id');
    }
    public function competitors()
    {
        return $this->belongstoMany(Participant::class, 'match_individual_competitors', 'match_id', 'competitor_id')->withPivot('event_group_member_id');
    }
    public function event_teams()
    {
        return $this->belongstoMany(EventTeam::class, 'match_event_teams', 'match_id', 'event_team_id')->withPivot('event_group_member_id');
    }

    public function round()
    {
        return $this->hasMany(MatchRound::class, 'match_id', 'id');
    }
    public function venue()
    {
        return $this->belongsTo(CompetitorVenue::class, "venue_id", "id");
    }
    public function match_individual_competitors(){
        return $this->hasMany(MatchIndividualCompetitor::class, "match_id", "id");
    }
    public function match_referee_relations(){
        return $this->hasMany(MatchRefereeRelation::class, 'match_id', 'id');
    }
    public function match_event_team(){
        return $this->hasMany(MatchEventTeam::class,'match_id','id');
    }
    public function venue_event_field(){
        return $this->belongsTo(CompetitorVenueEventField::class,'venue_event_field_id', 'id' );
    }

    public function match_event_teams(){
        return $this->hasMany(MatchEventTeam::class, 'match_id', 'id');
    }
    
    public function match_set(){
        return $this->hasMany(MatchSet::class,'match_id','id');
    }
    public function stage_qualification_competitor(){
        return $this->hasMany(StageQualificationCompetitor::class,"match_id","id");
    }
    public function event_statistics_match(){
        return $this->hasMany(EvenStatisticMatchRelation::class,"match_id","id");
    }
    public function event_statistic(){
        return $this->belongstoMany(EventStatistic::class,"event_statistics_match_relations","match_id","event_statistic_id");
    }
    public function match_sub_criterias_relations()
    {
        return $this->hasMany(MatchSubCriteriasRelation::class, "match_id", "id");
    }
}

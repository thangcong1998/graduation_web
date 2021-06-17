<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Stage extends Model
{
    protected $table = "stages";
    protected $fillable = ['event_id', 'name', 'english_name', 'match_score_type', 'round_result_type',
    'match_turn_num','stage_type', 'match_turn_num', 'match_scoring_method', 'unit', 'rank_type', 'sort_type', 'round_type', 'match_game_num'];

    const match_attendant_type = [
        '1VS1' => 1,
        '1VSN' => 2,
    ];

    const match_score_type = [
        'RECORD' => 1,
        'TARGET_RECORD' => 2,
        'SCORE' => 3,
        'SCORE_KO' => 4,
    ];

    const stage_type = [
        'QUALIFIED_USED_TABLE' => 1,
        'KNOCK_OUT' => 2,
        'ROUND_ROBIN' => 3
    ];

    const match_scoring_method = [
        'ROUND_WIN' => 1,
        'SUM_SCORE' => 2,
        'SUM_RECORD' => 3,
        'BEST_RECORD' => 4,
        'AVERAGE' => 5,
        'BEST_TARGET_RECORD' => 6,
        'WIN_LOSE' => 7,
        "AVERAGE_BETWEEN" => 8,
        "SUM_SCORE_KO" => 9
    ];

    const unit = [
        'HOUR' => 1,
        'MINUTE' => 2,
        'SECONDS' => 3,
        'KILOMETER' => 4,
        'METER' => 5,
        'CENTIMETER' => 6,
        "KILOGRAM" => 7
    ];

    const rank_type = [
        'MATCH_POINT' => 1,
        'RECORD' => 2
    ];

    const sort_type = [
        'ASC' => 1,
        'DESC' => 2
    ];

    const round_type = [
        'has_round' => 1,
        'has_set' => 2,
        'no_round' => 3
    ];

    const round_result_type = [
        'RECORD' => 1,
        'REFEREE_POINT' => 2,
        'ROUND_POINT' => 3,
        'ROUND_WIN' => 4,
    ];

    public function event()
    {
        return $this->belongsTo(SportDisciplineEvent::class, 'event_id', 'id');
    }

    public function matches()
    {
        return $this->hasMany(Match::class, 'stage_id', 'id');
    }

    public function event_groups()
    {
        return $this->hasMany(EventGroup::class, 'stage_id', 'id');
    }
    public function competition_dates()
    {
        return $this->hasMany(Match::class, 'stage_id', 'id');
    }
    public function event_rounds()
    {
        return $this->belongsToMany(EventRounds::class, 'stage_event_round_relations', 'stage_id', 'event_round_id');
    }

    public function event_sets()
    {
        return $this->belongsToMany(EventSet::class, 'stage_event_set_relations', 'stage_id', 'event_set_id');
    }

    public function stage_qualification_settings()
    {
        return $this->hasMany(QualificationSetting::class, 'stage_id', 'id');
    }
    public function previous_stage()
    {
        return $this->hasOne(QualificationSetting::class, 'qualified_to_stage_id', 'id');
    }
    public function next_stage()
    {
        return $this->belongsToMany(Stage::class, 'stage_qualification_settings', 'stage_id', 'qualified_to_stage_id');
    }
    public function match_points()
    {
        return $this->hasMany(StageMatchPoint::class, 'stage_id', 'id');
    }

    public function round_points()
    {
        return $this->hasMany(RoundPoint::class, 'stage_id', 'id');
    }

    public function stage_qualification_competitors()
    {
        return $this->hasMany(StageQualificationCompetitor::class, 'stage_id', 'id');
    }
    public function qualified_competitors()
    {
        return $this->hasMany(StageQualificationCompetitor::class, 'qualified_to_stage_id', 'id');
    }
    public function fouls()
    {
        return $this->hasMany(Foul::class,"event_id","event_id");
    }
    public function sub_criterias()
    {
        return $this->hasMany(SubCriteria::class, "stage_id", "id");
    }
}

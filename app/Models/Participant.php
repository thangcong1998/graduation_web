<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use OwenIt\Auditing\Contracts\Auditable;

class Participant extends Model implements Auditable
{
    use \OwenIt\Auditing\Auditable;
    use SoftDeletes;
    public $table = 'participants';
    public $fillable = [
        'card_no', 'card_template_id', 'organization_id', 'function_id', 'responsible_organization',
        'given_name', 'family_name', 'passport_no', 'passport_expire_date', 'personal_id_card_no',
        'personal_id_card_issue_date', 'personal_id_card_issue_department', 'sex', 'height', 'weight',
        'dob', 'country_of_birth_id', 'nationality_id', 'team_id', 'approval_status', 'profile_url', 'personal_id_card_url',
        'sport_id', 'sport_discipline_id', 'permanent_address', 'personal_card', 'received_status', 'printed_status', 'file_scan',
        'accreditation_number', 'doping_url', 'reprint', 'is_competitor', 'is_referee', 'registration_number'
    ];
    protected $with = ['team'];
    const gender = [
        'female' => 1,
        'male' => 2,
    ];

    const status = [
        'processing' => 1,
        'approved' => 2,
        'rejected' => 3
    ];

    const printed_status = [
        'printed' => 2,
        'not_printed_yet' => 1
    ];

    const received_status = [
        'received' => 2,
        'not_received' => 1
    ];
    const competitor = [
        'competitor' => 2,
        'not_competitor' => 1
    ];
    const referee = [
        'referee' => 2,
        'not_referee' => 1
    ];

    public function cardTemplate()
    {
        return $this->belongsTo(CardTemplate::class, 'card_template_id', 'id');
    }

    public function organization()
    {
        return $this->belongsTo(Organization::class, 'organization_id', 'id');
    }

    public function function()
    {
        return $this->belongsTo(Functions::class, 'function_id', 'id');
    }

    public function team()
    {
        return $this->belongsTo(Team::class, 'team_id', 'id');
    }

    public function countryOfBirth()
    {
        return $this->belongsTo(Country::class, 'country_of_birth_id', 'id');
    }

    public function nationality()
    {
        return $this->belongsTo(Country::class, 'nationality_id', 'id');
    }

    function sport()
    {
        return $this->belongsTo(Sport::class, 'sport_id', 'id');
    }

    function sportDiscipline()
    {
        return $this->belongsTo(SportDiscipline::class, 'sport_discipline_id', 'id');
    }
    public function sportDisciplineEvents()
    {
        return $this->belongsToMany(SportDisciplineEvent::class, "competitor_individual_event_relations", "participant_id", "event_id");
    }

    public function stage_qualification_competitors()
    {
        return $this->hasMany(StageQualificationCompetitor::class, "participant_id", "id");
    }

    public function event_qualification_competitors()
    {
        return $this->hasMany(EventQualificationCompetitor::class, "participant_id", "id");
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use OwenIt\Auditing\Contracts\Auditable;

class Referee extends Model implements Auditable
{
    use \OwenIt\Auditing\Auditable;
    public $table = 'referees';
    public $fillable = [
        'given_name', 'family_name', 'passport_no', 'passport_expire_date',
        'personal_id_card_no', 'personal_id_card_issue_date', 'personal_id_card_url',
        'personal_id_card_issue_department', 'sex', 'country_of_birth_id',
        'nationality_id', 'permanent_address', 'profile_url', 'accreditation_number', 'dob', 'sport_id', 'sport_discipline_id'
    ];
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
        return $this->belongsToMany(SportDisciplineEvent::class, "referee_event_relations", "referee_id", "event_id");
    }
}

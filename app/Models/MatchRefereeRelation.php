<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MatchRefereeRelation extends Model
{
    protected $table = 'match_referee_relations';
    protected $fillable = ['match_id', 'referee_id', 'referee_role_id'];

    public function match()
    {
        return $this->belongsTo(Match::class, 'match_id', 'id');
    }
    public function referee()
    {
        return $this->belongsTo(Referee::class, 'referee_id', 'id');
    }
    public function referee_role()
    {
        return $this->belongsTo(FunctionsReferee::class, 'referee_role_id', 'id');
    }
}

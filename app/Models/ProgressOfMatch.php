<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProgressOfMatch extends Model
{
    //
    protected $table = "progress_of_match";
    protected $fillable = [
        "match_id", "foul_id", "player_id", "player_id_out",
        "time", "type", "tns","event_team_id","own_goal"
    ];

    const type = [
        "ACHIEVEMENTS" => 1,
        "FOUL" => 2,
        "CHANGE" => 3,
    ];
    
    public function match(){
        return $this->belongsTo(Match::class,'match_id','id');
    }

    public function foul(){
        return $this->belongsTo(Foul::class,"foul_id","id");
    }
    public function player(){
        return $this->belongsTo(Participant::class,"player_id","id");
    }
    public function player_out(){
        return $this->belongsTo(Participant::class,"player_id_out","id");
    }
    public function event_team(){
        return $this->belongsTo(EventTeam::class,"event_team_id","id");
    }
}

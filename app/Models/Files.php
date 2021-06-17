<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Files extends Model
{
    protected $table = 'files';
    protected $fillable = [
        'ref_id', 'ref', 'name', 'path', 'team_id', 'user_id'
    ];
    public function ref()
    {
        return $this->morphTo();
    }
//    public function team()
//    {
//        return $this->belongsTo(Team::class, 'team_id', 'id');
//    }
//    public function sportDisciptline()
//    {
//        return $this->belongsTo(SportDiscipline::class, 'ref_id', 'id');
//    }
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }
}

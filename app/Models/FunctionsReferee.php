<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use OwenIt\Auditing\Contracts\Auditable;
use Illuminate\Database\Eloquent\SoftDeletes;

class FunctionsReferee extends Model  implements Auditable
{
    //
    use SoftDeletes;
    use \OwenIt\Auditing\Auditable;
    protected $table = 'functions_referee';
    protected $fillable = ['name', 'english_name', 'event_id'];

    public function event()
    {
        return $this->belongsTo(SportDisciplineEvent::class, "event_id", "id");
    }
}

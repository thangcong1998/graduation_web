<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use OwenIt\Auditing\Contracts\Auditable;

class Sport extends Model implements Auditable
{
    use \OwenIt\Auditing\Auditable;
    use SoftDeletes;
    public $table = "sports";
    public $fillable = [
        'name', 'english_name', 'icon', "code"
    ];

    public function sportDisciplines()
    {
        return $this->hasMany(SportDiscipline::class, 'sport_id', 'id');
    }
}

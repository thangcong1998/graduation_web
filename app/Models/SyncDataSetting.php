<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use OwenIt\Auditing\Contracts\Auditable;

class SyncDataSetting extends Model implements Auditable
{
    //
    use \OwenIt\Auditing\Auditable;
    protected $table = 'sync_data_setting';
    protected $fillable = [
        'name', 'english_name', 'api_url',
    ];
}

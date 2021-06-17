<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AuditSyncDataSetting extends Model
{
    //
    protected $table = 'audit_sync_data_setting';
    protected $fillable = [
        'name', 'status',
    ];
}

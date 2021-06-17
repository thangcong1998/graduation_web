<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DisplaySetting extends Model
{
    protected $table = 'display_setting';
    protected $fillable = ['logo_url', 'image_url'];

    public function files(){
        return $this->morphMany(Files::class,'ref');
    }
}

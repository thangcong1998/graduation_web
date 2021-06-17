<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class DisplayCard extends Model
{
    use SoftDeletes;
    protected $table = 'm_card_displays';
    protected $fillable = [
        'background_url', 'front_icon_url', 'back_icon_url', 'condition_text', 'sign_icon_url', 'sign_text', 'description_text',
    ];
}

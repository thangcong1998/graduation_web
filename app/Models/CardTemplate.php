<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use OwenIt\Auditing\Contracts\Auditable;

class CardTemplate extends Model implements Auditable
{
    use \OwenIt\Auditing\Auditable;
    use SoftDeletes;
    protected $table = 'm_card_templates';
    protected $fillable = [
        'name', 'background_color', 'text_color', 'text'
    ];
    public function Functions()
    {
        return $this->belongsTo(Functions::class, 'card_template_id', 'id');
    }
}

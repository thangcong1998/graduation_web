<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\App;

class ZoneUpdateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'name' => 'unique:m_access_zones,name,'.$this->zone_id,
            'icon_url' => 'unique:m_access_zones,icon_url,'.$this->zone_id,
        ];
    }

    public function attributes()
    {
        $attribute = [];

        if(App::getLocale() === 'vi') {
            $attribute = [
                'name' => 'mã khu vực',
                'icon_url' => " icon mã khu vực",
            ];
        }
        if(App::getLocale() === 'en') {
            $attribute = [
                'name' => 'name',
                'icon_url' => 'icon url',
            ];
        }
        return $attribute;
    }
}

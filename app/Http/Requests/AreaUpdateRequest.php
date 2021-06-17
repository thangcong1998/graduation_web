<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\App;

class AreaUpdateRequest extends FormRequest
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
            'name' => 'unique:m_access_areas,name,'.$this->area_id,
//            'icon_url' => 'unique:m_access_areas,icon_url,'.$this->area_id
        ];
    }

    public function attributes()
    {
        $attribute = [];
        if(App::getLocale() === 'vi') {
            $attribute = [
                'name' => 'tên mã vùng',
                'icon_url' => " icon mã vùng",
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

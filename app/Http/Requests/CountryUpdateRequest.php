<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\App;

class CountryUpdateRequest extends FormRequest
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
            'country_code_3_digits' => 'unique:m_countries,country_code_3_digits,'.$this->country_id,
            'name' => 'unique:m_countries,name,'.$this->country_id,
        ];
    }

    public function attributes()
    {
        $attribute = [];
        if(App::getLocale() === 'vi') {
            $attribute = [
                'name' => 'tên quốc gia',
                'country_code_3_digits' => "mã quốc gia",
            ];
        }
        if(App::getLocale() === 'en') {
            $attribute = [
                'name' => 'name',
                'country_code_3_digits' => 'country code',
            ];
        }
        return $attribute;
    }
}

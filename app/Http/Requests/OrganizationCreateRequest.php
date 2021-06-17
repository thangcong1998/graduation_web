<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\App;

class OrganizationCreateRequest extends FormRequest
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
            'name' => 'unique:m_organizations',
            'english_name' => 'unique:m_organizations',
            'abbreviation' => 'unique:m_organizations'
        ];
    }

    public function attributes()
    {
        $attribute = [];
        if(App::getLocale() === 'vi') {
            $attribute = [
                'name' => 'tên tổ chức',
                'english_name' => "tên tổ chức(tiếng anh)",
                'abbreviation' => "tên viết tắt",
            ];
        }
        if(App::getLocale() === 'en') {
            $attribute = [
                'name' => 'name',
                'english_name' => "english name",
                'abbreviation' => "abbreviation",
            ];
        }
        return $attribute;
    }
}

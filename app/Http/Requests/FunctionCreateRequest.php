<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\App;

class FunctionCreateRequest extends FormRequest
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
            'code' => 'unique:m_functions'
        ];
    }

    public function attributes()
    {
        $attribute = [];
        if(App::getLocale() === 'vi') {
            $attribute = [
                'code' => 'mã chức vụ',
            ];
        }
        if(App::getLocale() === 'en') {
            $attribute = [
                'code' => 'code',
            ];
        }
        return $attribute;
    }
}

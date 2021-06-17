<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\App;

class CardTemplateCreateRequest extends FormRequest
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
            'name' => 'unique:m_card_templates',
        ];
    }

    public function attributes()
    {
        $attribute = [];
        if(App::getLocale() === 'vi') {
            $attribute = [
                'name' => 'tên mã thẻ',
                'text' => "ký hiệu của thẻ",
            ];
        }
        if(App::getLocale() === 'en') {
            $attribute = [
                'name' => 'name',
                'text' => 'text',
            ];
        }
        return $attribute;
    }
}

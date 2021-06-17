<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\App;

class RefereeStoreRequest extends FormRequest
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
        $rules = [];

        if ($this->get('passport_no') != null) {
            $rules['passport_no'] =  'unique:referees,passport_no';
        }

        if ($this->get('personal_id_card_no') != null) {
            $rules['personal_id_card_no'] = 'unique:referees,personal_id_card_no';
        }

        $rules['accreditation_number'] = 'unique:referees,accreditation_number';

        return $rules;
    }

    public function attributes()
    {
        $attribute = [];
        if (App::getLocale() === 'vi') {
            $attribute = [
                'passport_no' => 'số hộ chiếu',
                'personal_id_card_no' => 'số chứng minh thư'
            ];
        }
        if (App::getLocale() === 'en') {
            $attribute = [
                'passport_no' => 'passport no',
                'personal_id_card_no' => 'personal id card no',
            ];
        }
        return $attribute;
    }
}

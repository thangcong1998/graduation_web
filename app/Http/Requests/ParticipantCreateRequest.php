<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\App;

class ParticipantCreateRequest extends FormRequest
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
        if ($this->has('dob')) {
            $rules['dob'] = ['date', 'before:today'];
        }
        if ($this->get('passport_expire_date') != null) {
            $rules['passport_expire_date'] = ['date', 'after:today'];
        }
        if ($this->get('personal_id_card_issue_date') != null) {
            $rules['personal_id_card_issue_date'] = 'date';
        }

        if ($this->get('passport_no') != null) {
            $rules['passport_no'] =  'unique:participants,passport_no';
        }

        if ($this->get('personal_id_card_no') != null) {
            $rules['personal_id_card_no'] = 'unique:participants,personal_id_card_no';
        }

        return $rules;
    }
    public function attributes()
    {
        $attribute = [];
        if (App::getLocale() === 'vi') {
            $attribute = [
                'passport_no' => 'số hộ chiếu',
                'passport_expire_date' => 'ngày hết hạn hộ chiếu',
                'personal_id_card_no' => 'số chứng minh thư'
            ];
        }
        if (App::getLocale() === 'en') {
            $attribute = [
                'passport_no' => 'passport no',
                'passport_expire_date' => 'passport expire date',
                'personal_id_card_no' => 'personal id card no',
            ];
        }
        return $attribute;
    }
}

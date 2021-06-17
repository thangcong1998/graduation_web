<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Str;

class UpdateSportDisciplineEvent extends FormRequest
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
            //
            "round.*.name" => "required"
        ];
    }
    public function attributes()
    {
        $attribute = [];
        if (App::getLocale() === 'vi') {
            $attribute = [
                'round.*.name' => 'tên hiệp',
            ];
        }
        if (App::getLocale() === 'en') {
            $attribute = [
                'round.*.name' => 'name round',
            ];
        }
        return $attribute;
    }
    protected function prepareForValidation()
    {
        $this->merge([
            'round' => json_decode($this->round, true),
        ]);
    }
}

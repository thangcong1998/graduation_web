<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\App;

class EventTeamStoreRequest extends FormRequest
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
            "name" => "max:255|unique:event_teams,name,{$this->team_id}"
        ];
    }
    public function attributes()
    {
        $attribute = [];
        if (App::getLocale() === 'vi') {
            $attribute = [
                'name' => 'tên đội',
            ];
        }
        if (App::getLocale() === 'en') {
            $attribute = [
                'name' => 'name',
            ];
        }
        return $attribute;
    }
}

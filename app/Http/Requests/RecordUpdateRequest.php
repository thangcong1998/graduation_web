<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\App;

class RecordUpdateRequest extends FormRequest
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
            'event_id' => 'required|unique:records,event_id,'.$this->id
        ];
    }
    public function attributes()
    {
        $attribute = [];
        if (App::getLocale() === 'vi') {
            $attribute = [
                'event_id' => "bộ huy chương",
            ];
        }
        if (App::getLocale() === 'en') {
            $attribute = [
                'event_id' => 'Event',
            ];
        }
        return $attribute;
    }
}

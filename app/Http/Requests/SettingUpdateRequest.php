<?php

namespace App\Http\Requests;

use App\Models\Setting;
use Illuminate\Foundation\Http\FormRequest;

class SettingUpdateRequest extends FormRequest
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
        $rules = [
            'password' => 'min:6|max:20'
        ];
        $setting = Setting::query()->first();
        if ($setting['email'] != $this->email) {
            $rules['password'] = 'required|min:6|max:20';
        }
        return $rules;
    }
}

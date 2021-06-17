<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TeamCreateRequest extends FormRequest
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
            'name' => 'unique:team',
//            'phone' => ['required', 'regex:/^(\+?84|0)[1-9]{1}[0-9]{8,9}$/','max:10', 'unique:users'],
//            'email' => 'email|unique:users'
        ];
    }
}

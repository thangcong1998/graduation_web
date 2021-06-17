<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UserUpdateRequest extends FormRequest
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
        $rule = [
            'user_name' => 'required|unique:users,user_name,'.$this->id.'|min:6',
            'email' => 'required|email|unique:users,email,'.$this->id,
            'phone' => 'required|unique:users,phone,'.$this->id ,
            'name' => 'required',
        ];
        if ($this->password) {
            $rule['password'] = 'min:6';
        }
        return $rule;
    }
}

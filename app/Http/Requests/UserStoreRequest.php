<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UserStoreRequest extends FormRequest
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
            'user_name' => 'required|unique:users,user_name|min:6',
            'password' => 'min:6',
            'email' => ['regex:/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/', 'max:255', 'email', 'unique:users,email,' . $this->user_id],
            'phone' => ['required', 'max:15', 'unique:users,phone,' . $this->user_id],
            'name' => ['required:users,name' . $this->user_id],
        ];
    }
}

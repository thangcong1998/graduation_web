<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Validation\ValidationException;
use Illuminate\Http\JsonResponse;

class BaseRequest extends FormRequest
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
        //
    }

    /**
     * Overriding the event validator for custom error response.
     *
     * @param Validator $validator
     */
    public function failedValidation(Validator $validator)
    {
        $errors = (new ValidationException($validator))->errors();
        foreach ($errors as $key => $error) {
            $errors[$key] = $error[0];
        }
        throw new HttpResponseException(response()->json($errors, JsonResponse::HTTP_BAD_REQUEST));
    }
}

<?php

namespace App\Http\Requests;

use App\Models\Stage;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\App;

class MatchUpdateRequest extends FormRequest
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
        $stage = new Stage();
        $rules = [
            'name' => 'max:255',
            // 'competitors' => 'required',
            'venue_id' => 'required'
        ];
        // if ($this->match_type == stage::match_attendant_type['1VS1']) {
        //     $rules['competitors'] = ["required", "array", "size: 2"];
        // }
        return $rules;
    }

    public function attributes()
    {
        $attribute = [];
        if (App::getLocale() === 'vi') {
            $attribute = [
                'competitors' => 'Vận động viên / đội thi đấu',
                'venue_id' => 'Địa điểm thi đấu'
            ];
        }
        if (App::getLocale() === 'en') {
            $attribute = [
                'venue_id' => 'Venue'
            ];
        }
        return  $attribute;
    }
}

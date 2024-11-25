<?php

namespace App\Http\Requests\User;

use App\Http\Requests\UserRequest;
use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;

class ProfileUpdateRequest extends UserRequest
{

    
    public function authorize(): bool 
    {
        return (boolean) $this->user();
    }


    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\Rule|array|string>
     */
    public function rules($id = null): array
    {
        $rules = parent::rules(); 
        $upload_file_limit = config('broadtools.upload_file_limit');
        $rules['profile_image'] = [
            'file',
            'mimetypes:' . implode(',', $upload_file_limit['image']['mimes']),
            'extensions:' . implode(',', $upload_file_limit['image']['extensions']),
        ];

        return $rules;
    }
}

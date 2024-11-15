<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Elegant\Sanitizer\Laravel\SanitizesInput;
use Illuminate\Support\Facades\Log;

class UserRequest extends FormRequest
{
    use SanitizesInput;

    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()->hasPermissionTo('admin account');
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $id = $this->route('user');

        $method = strtoupper($this->method());
        $rules = [
            'name' => ['required'],
            'email' => ['required', 'max:255', 'email',],
            'password' => ['sometimes', 'string', 'min:8'],
            'roles.*.id' => ['required', 'integer'],
        ];

        switch ($method) {
            case "POST":
                $rules['email'][] =  'unique:users,email';
                return $rules;
            case "PUT":
            case "PATCH":
                $rules['email'][] =  'unique:users,email,' . $id;
                return $rules;
                break;
            default:
                return [];
        }
    }


    public function filters()
    {
        return [
            'name' => ['zentohan',],
            'email' => ['zentohan',],
            'password' => [],
        ];
    }


    public function attributes()
    {
        return [
            'name' => '名前',
            'email' => 'メールアドレス',
            'password' => 'パスワード',
        ];
    }
}

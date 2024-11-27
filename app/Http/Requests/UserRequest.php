<?php

namespace App\Http\Requests;

use App\Constants\PermissionConstant;
use Illuminate\Foundation\Http\FormRequest;
use Elegant\Sanitizer\Laravel\SanitizesInput;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rules\Password;

class UserRequest extends FormRequest
{
    use SanitizesInput;

    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $user = $this->user();
        return $user  && $user->hasPermissionTo(PermissionConstant::Admin);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules($id = null): array
    {
        $method = strtoupper($this->method());
        $rules = [
            'name' => ['required',],
            'email' => ['required', 'max:255', 'email',],
            'password' => ['sometimes', Password::defaults(), 'confirmed'],
            'roles.*.id' => ['required', 'integer'],
        ];

        if (is_null($id)) {
            $id = $this->route('user');
            if (!$id) {
                $id = $this->user()->id;
            }
        }

        switch ($method) {
            case "GET":
                $rules = [];
            case "POST":
                $rules['email'][] =  'unique:users,email';
                break;
            case "PUT":
            case "PATCH":
                $rules['email'][] =  'unique:users,email,' . $id;
                break;
            case "DELETE":
                $rules = [];
            default:
                break;
        }
        return $rules;
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
            'profile_image' => 'プロフィール画像',
        ];
    }
}

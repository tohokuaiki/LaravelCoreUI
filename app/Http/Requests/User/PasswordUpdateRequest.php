<?php

namespace App\Http\Requests\User;

use App\Http\Requests\UserRequest;

class PasswordUpdateRequest extends UserRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return (bool) $this->user();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules($id = null): array
    {
        $parent_rules = parent::rules($id);
        $rules['password'] = $parent_rules['password']; // we need not another rules except password.
        $rules['current_password'] = ['required', 'current_password'];
        return $rules;
    }
}

<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\User\PasswordUpdateRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;

class PasswordController extends Controller
{
    /**
     * Update the user's password.
     */
    public function update(PasswordUpdateRequest $request): RedirectResponse | JsonResponse
    {
        $data = $request->validated();
        $request->user()->update([
            'password' => Hash::make($data['password']),
        ]);

        if ($request->ajax()) {
            Auth::logout(); // require re-login as token changed.
            return response()->json([]);
        }

        return back();
    }
}

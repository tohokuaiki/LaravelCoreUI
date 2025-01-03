<?php

namespace App\Http\Controllers;

use App\Http\Requests\User\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;
use Laravel\Sanctum\Contracts\HasApiTokens;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse | JsonResponse
    {
        $data = $request->validated();
        $user = $request->user();
        $user->fill($data);
        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $user->save();
        $user->uploadMedia($request, 'profile_image');
        if ($request->ajax()){
            return response()->json(['user' => $user]);
        }

        return Redirect::route('profile.edit');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse | \Illuminate\Http\Response
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();   

        Auth::guard('web')->logout();
        $sanctum_user = Auth::guard('sanctum')->user();
        if (in_array(HasApiTokens::class, class_uses($sanctum_user))){
            call_user_func([$sanctum_user, 'tokens'])->delete();
        }
        // Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        if ($request->ajax()){
            return Inertia::location('/');
        }

        return Redirect::to('/');
    }
}

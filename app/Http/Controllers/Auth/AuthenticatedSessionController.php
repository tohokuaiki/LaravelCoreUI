<?php

namespace App\Http\Controllers\Auth;

use App\Events\LoginSuccess;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;
use \Symfony\Component\HttpFoundation\Response as HttpResponse;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): HttpResponse
    {
        $request->authenticate();

        $request->session()->regenerate();

        $redirect_url = $request->session()->pull('url.intended', route('coreuiadmin'));

        LoginSuccess::dispatch($request->user());

        return Inertia::location($redirect_url);
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse | HttpResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        if ($request->ajax()){
            return Inertia::location(route('login'));
        }
        return redirect('/');
    }
}

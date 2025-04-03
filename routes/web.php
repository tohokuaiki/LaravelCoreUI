<?php

use App\Models\User;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

Route::get('/', function () {
    return redirect()->route(Auth::check() ? 'coreuiadmin' : 'login');
})->name('root');

$admin_path = config('app.admin_path');
Route::prefix($admin_path)->get('/{operation?}/{target?}/{property?}', function () use ($admin_path) {
    return Inertia::render('Default', [
        'ADMIN_PATH' => $admin_path,
        'config' => config('broadtools'),
        'mustVerifyEmail' => in_array(MustVerifyEmail::class, class_implements(User::class)),
        'roles' => Role::all(),
    ]);
})->middleware(['auth', 'verified'])->name('coreuiadmin');

require __DIR__ . '/auth.php';

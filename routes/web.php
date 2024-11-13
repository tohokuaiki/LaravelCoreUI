<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
})->name('root');

$admin_path = config('app.admin_path');
Route::get($admin_path . '/{operation?}/{target?}/{property?}', function () use ($admin_path) {
    return Inertia::render('Default', [
        'ADMIN_PATH' => $admin_path,
        'config' => config('broadtools'),
        'roles' => Role::all(),
    ]);
})->middleware(['auth', 'verified'])->name('coreuiadmin');

Route::middleware('auth')->prefix('/admin')->name('admin.')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';

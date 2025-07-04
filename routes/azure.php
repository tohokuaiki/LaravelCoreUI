<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\Azure\OpenIDController;

Route::get('/login', [OpenIDController::class, "create"])->name('login');

Route::name('azure.')->prefix('/azure/auth')->group(function () {
    Route::get('/redirect', [OpenIDController::class, "loginRedirect"])->name('redirect');
    Route::get('/callback', [OpenIDController::class, "callback"])->name('callback');
});
Route::middleware('auth')->group(function () {
    Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])
        ->name('logout');
});

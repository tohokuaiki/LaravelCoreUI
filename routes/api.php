<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\RoleController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

$admin_path = config('app.admin_path');
Route::middleware('auth:sanctum')->prefix($admin_path)->group(function () use ($admin_path) {
    Route::apiResource('/users', UserController::class);
    Route::apiResource('/roles', RoleController::class);
});

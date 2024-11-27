<?php

namespace App\Http\Controllers;

use App\Http\Requests\UserRequest;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Log;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(UserRequest $request)
    {
        $users = User::get();
        return response()->json($users);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(UserRequest $request)
    {
        $data = $request->validated();
        $user = User::create($data);
        foreach ($data['roles'] ?? [] as $role) {
            if ($role = Role::find($role['id'])) {
                $user->assignRole($role);
            }
        }
        $user->roles;
        return response()->json($user, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(UserRequest $request, string $id)
    {
        //
        $user = User::find($id)->with('roles');
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }
        return response()->json($user);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UserRequest $request, string $id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $data = $request->validated();
        $user->update($data);
        $user->syncRoles(array_map(fn($role) => $role['id'], $data['roles'] ?? []))->load('roles');

        return response()->json($user);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(UserRequest $request, int $id)
    {
        //
        $user = User::find($id);
        if (!$user) {
            return response()->json(['message' => '削除対象のユーザーが見つかりません。既に削除済みのようです。'], 404);
        }
        $operate_user = $request->user();

        if ($id === $operate_user->id) {
            return response()->json(['message' => '自分自身は削除できません。'], 403);
        }

        $user->delete();
        return response()->json(['message' => 'User deleted successfully']);
    }
}

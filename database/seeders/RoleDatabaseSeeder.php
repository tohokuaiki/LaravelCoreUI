<?php

namespace Database\Seeders;

use App\Constants\PermissionConstant;
use App\Constants\RoleConstant;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use App\Models\User;

class RoleDatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // ロール作成
        $adminRole = Role::create(['name' => RoleConstant::Admin]);

        // 権限作成
        $permissions = [
            ['name' => PermissionConstant::Admin],
        ];
        foreach ($permissions as $permission) {
            $registerPermission = Permission::create($permission);
            $adminRole->givePermissionTo($registerPermission);
        }
        $adminUser = User::find(1);
        $adminUser->assignRole($adminRole);
    }
}

<?php

namespace App\Observers;

use App\Constants\RoleConstant;
use App\Models\User;
use Illuminate\Support\Facades\Log;

class UserObserver
{
    /**
     * Handle the User "created" event.
     */
    public function created(User $user): void
    {
        $admin_exists = User::whereHas('roles', function ($query) {
            $query->where('name', RoleConstant::Admin);
        })->exists();
        if (!$admin_exists){
            $user->assignRole(RoleConstant::Admin);
        }
    }

    /**
     * Handle the User "updated" event.
     */
    public function updated(User $user): void
    {
        //
    }

    /**
     * Handle the User "deleted" event.
     */
    public function deleted(User $user): void
    {
        //
    }

    /**
     * Handle the User "restored" event.
     */
    public function restored(User $user): void
    {
        //
    }

    /**
     * Handle the User "force deleted" event.
     */
    public function forceDeleted(User $user): void
    {
        //
    }
}

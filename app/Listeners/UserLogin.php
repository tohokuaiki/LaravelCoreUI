<?php

namespace App\Listeners;

use App\Events\LoginSuccess;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Log;

class UserLogin
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(LoginSuccess $event): void
    {
        $user = $event->user;
        $user->last_login_at = now();
        $user->save();
    }
}

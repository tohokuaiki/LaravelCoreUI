<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class ElegantwebFilter extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
        \Sanitizer::extend("zentohan", \App\Http\Requests\Filters\Zentohan::class);
    }
}

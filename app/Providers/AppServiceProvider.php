<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\URL;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
public function boot(): void
    {
        // ✅ PAKSA HTTPS DI PRODUCTION
        if (config('app.env') === 'production' || str_contains(config('app.url'), 'https')) {
            URL::forceScheme('https');
        }
    }

//     public function boot(): void
// {
//     // ✅ UBAH MENJADI SEPERTI INI:
//     // Hanya paksa HTTPS jika environment adalah 'production'
//     if ($this->app->environment('production')) {
//         \Illuminate\Support\Facades\URL::forceScheme('https');
//     }
// }
}

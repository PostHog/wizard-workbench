<?php

namespace App\Providers;

use App\Models\Subscription;
use App\Support\Branding;
use Illuminate\Support\Facades\View;
use Illuminate\Support\ServiceProvider;
use Laravel\Cashier\Cashier;
use PostHog\PostHog;

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
        PostHog::init(env('VITE_POSTHOG_KEY'), [
            'host' => env('VITE_POSTHOG_HOST', 'https://us.i.posthog.com'),
        ]);

        Cashier::useSubscriptionModel(Subscription::class);

        config([
            'app.name' => Branding::name(),
            'mail.from.address' => Branding::supportEmail() ?? config('mail.from.address'),
            'mail.from.name' => Branding::name(),
        ]);

        View::share('brand', Branding::all());
    }
}

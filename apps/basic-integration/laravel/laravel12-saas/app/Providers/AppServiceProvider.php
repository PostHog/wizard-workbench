<?php

namespace App\Providers;

use App\Models\Subscription;
use App\Services\PostHogService;
use App\Support\Branding;
use Illuminate\Support\Facades\View;
use Illuminate\Support\ServiceProvider;
use Laravel\Cashier\Cashier;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // Share a single PostHogService instance across the request lifecycle
        $this->app->singleton(PostHogService::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Eagerly initialize PostHog so it is available in the exception handler
        $this->app->make(PostHogService::class);

        Cashier::useSubscriptionModel(Subscription::class);

        config([
            'app.name' => Branding::name(),
            'mail.from.address' => Branding::supportEmail() ?? config('mail.from.address'),
            'mail.from.name' => Branding::name(),
        ]);

        View::share('brand', Branding::all());
    }
}

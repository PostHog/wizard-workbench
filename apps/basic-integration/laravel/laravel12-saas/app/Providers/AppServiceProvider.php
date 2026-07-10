<?php

namespace App\Providers;

use App\Models\Subscription;
use App\Services\PostHogService;
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
        if (filled(config('services.posthog.api_key')) && ! config('services.posthog.disabled', false)) {
            PostHog::init(config('services.posthog.api_key'), [
                'host' => config('services.posthog.host'),
            ]);
        }

        $this->app->singleton(PostHogService::class);

        Cashier::useSubscriptionModel(Subscription::class);

        config([
            'app.name' => Branding::name(),
            'mail.from.address' => Branding::supportEmail() ?? config('mail.from.address'),
            'mail.from.name' => Branding::name(),
        ]);

        View::share('brand', Branding::all());
    }
}

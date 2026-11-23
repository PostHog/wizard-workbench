<?php

namespace App\Providers;

use App\Models\Subscription;
use App\Support\Branding;
use Illuminate\Support\Facades\Log;
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
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        if (! app()->environment('production') && config('posthog.enabled')) {
            if (blank(config('posthog.api_key'))) {
                Log::warning('POSTHOG_API_KEY variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once POSTHOG_API_KEY is configured');
            }

            if (blank(config('posthog.host'))) {
                Log::warning('POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once POSTHOG_HOST is configured');
            }
        }

        Cashier::useSubscriptionModel(Subscription::class);

        config([
            'app.name' => Branding::name(),
            'mail.from.address' => Branding::supportEmail() ?? config('mail.from.address'),
            'mail.from.name' => Branding::name(),
        ]);

        View::share('brand', Branding::all());
    }
}

@php
    $brand = config('branding');
    $brandName = data_get($brand, 'name', config('app.name', 'Laravel'));
    $tagline = data_get($brand, 'tagline', 'Launch faster with a production-ready SaaS kit.');
@endphp

<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        <x-seo :title="$brandName" :description="$tagline" />
        <link rel="icon" href="{{ asset(data_get($brand, 'assets.favicon', 'favicon.ico')) }}" type="image/svg+xml">
        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=manrope:300,400,500,600,700&display=swap" rel="stylesheet" />
        <link href="https://fonts.bunny.net/css?family=space-grotesk:400,500,600,700&display=swap" rel="stylesheet" />

        <!-- Scripts -->
        @vite(['resources/css/app.css', 'resources/js/app.js'])

        <!-- PostHog -->
        <script>
            !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]);t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.crossOrigin="anonymous",p.async=!0,p.src=s.api_host+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+" (stub)"},o="init capture register register_once register_for_session unregister unregister_for_session getFeatureFlag getFeatureFlagPayload isFeatureEnabled reloadFeatureFlags updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures on onFeatureFlags onSessionId getSurveys getActiveMatchingSurveys renderSurvey canRenderSurvey identify setPersonProperties group resetGroups setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags resetGroupPropertiesForFlags reset get_distinct_id getGroups get_session_id get_session_replay_url alias set_config startSessionRecording stopSessionRecording sessionRecordingStarted captureException loadToolbar get_property getSessionProperty createPersonProfile opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing clear_opt_in_out_capturing debug".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
            posthog.init("{{ config('posthog.api_key') }}", {
                api_host: "{{ config('posthog.host') }}",
                person_profiles: "identified_only",
            });
        </script>
    </head>
    <body class="min-h-screen antialiased">
        <div class="grid min-h-screen lg:grid-cols-2">
            <div class="relative hidden overflow-hidden border-r border-sand-200 bg-sand-50 px-10 py-12 lg:flex">
                <div class="absolute -top-24 left-0 h-72 w-72 rounded-full bg-[radial-gradient(circle_at_center,var(--color-clay-500),transparent_70%)] opacity-35 blur-3xl"></div>
                <div class="relative z-10 flex h-full flex-col justify-between">
                    <div class="space-y-4">
                        <div class="flex items-center gap-3 font-display text-lg">
                            <span class="flex h-10 w-10 items-center justify-center rounded-full bg-ink-900 text-white">
                                {{ strtoupper(substr($brandName, 0, 1)) }}
                            </span>
                            <span>{{ $brandName }}</span>
                        </div>
                        <p class="max-w-sm text-lg text-ink-700">
                            {{ $tagline }}
                        </p>
                    </div>
                    <div class="space-y-3 text-sm text-ink-600">
                        <div class="flex items-center gap-2">
                            <span class="h-2 w-2 rounded-full bg-moss-500"></span>
                            Billing-ready with Cashier and Stripe
                        </div>
                        <div class="flex items-center gap-2">
                            <span class="h-2 w-2 rounded-full bg-clay-500"></span>
                            Livewire + Alpine powered workflows
                        </div>
                        <div class="flex items-center gap-2">
                            <span class="h-2 w-2 rounded-full bg-ink-600"></span>
                            SEO, OG images, and email templates
                        </div>
                    </div>
                </div>
            </div>

            <div class="flex items-center justify-center px-6 py-12">
                <div class="w-full max-w-md rounded-3xl border border-sand-200 bg-white/85 p-8 shadow-xl shadow-ink-900/10">
                    <div class="mb-6">
                        <a href="{{ route('home') }}" class="flex items-center gap-3 font-display text-lg text-ink-900">
                            <span class="flex h-9 w-9 items-center justify-center rounded-full bg-ink-900 text-white">
                                {{ strtoupper(substr($brandName, 0, 1)) }}
                            </span>
                            <span>{{ $brandName }}</span>
                        </a>
                    </div>
                    {{ $slot }}
                </div>
            </div>
        </div>

        @include('cookie-consent::index')
    </body>
</html>

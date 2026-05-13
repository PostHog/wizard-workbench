@props(['title' => null, 'description' => null])

<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        <x-seo :title="$title" :description="$description" />
        <link rel="icon" href="{{ asset(data_get(config('branding'), 'assets.favicon', 'favicon.ico')) }}" type="image/svg+xml">

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=manrope:300,400,500,600,700&display=swap" rel="stylesheet" />
        <link href="https://fonts.bunny.net/css?family=space-grotesk:400,500,600,700&display=swap" rel="stylesheet" />

        <!-- Scripts -->
        @vite(['resources/css/app.css', 'resources/js/app.js'])
        @livewireStyles

        @if(config('posthog.api_key') && !config('posthog.disabled'))
        <script>
            !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.crossOrigin="anonymous",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+" (stub)"},o="init capture register register_once register_for_session unregister unregister_for_session getFeatureFlag getFeatureFlagPayload isFeatureEnabled reloadFeatureFlags updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures on onFeatureFlags onSessionId getSurveys getActiveMatchingSurveys renderSurvey canRenderSurvey identify setPersonProperties group resetGroups setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags resetGroupPropertiesForFlags reset get_distinct_id getGroups get_session_id get_session_replay_url alias set_config startSessionRecording stopSessionRecording sessionRecordingStarted captureException loadToolbar get_property getSessionProperty createPersonProfile opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing clear_opt_in_out_capturing debug".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);

            posthog.init('{{ config('posthog.api_key') }}', {
                api_host: '{{ config('posthog.host') }}',
                person_profiles: 'identified_only',
            });

            @auth
            posthog.identify('{{ auth()->id() }}', {
                email: '{{ auth()->user()->email }}',
                name: '{{ auth()->user()->name }}',
            });
            @endauth
        </script>
        @endif
    </head>
    <body class="min-h-screen antialiased">

        <div class="relative min-h-screen overflow-hidden">
            <div class="absolute inset-0 -z-10 bg-sand-50"></div>
            <div class="absolute -top-40 right-0 -z-10 h-80 w-80 rounded-full bg-[radial-gradient(circle_at_center,var(--color-clay-500),transparent_68%)] opacity-30 blur-3xl"></div>
            <div class="absolute -bottom-48 left-0 -z-10 h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(circle_at_center,var(--color-moss-500),transparent_70%)] opacity-20 blur-3xl"></div>

            <div class="mx-auto w-full max-w-6xl px-6 pt-6">
                <livewire:layout.navigation />
            </div>

            @if (isset($header))
                <header class="mx-auto w-full max-w-6xl px-6 pt-8">
                    <div class="rounded-3xl border border-sand-200 bg-white/80 px-6 py-5 shadow-sm">
                        {{ $header }}
                    </div>
                </header>
            @endif

            <main class="mx-auto w-full max-w-6xl px-6 pb-16 pt-8">
                @if (session('success'))
                    <div class="mb-6 rounded-2xl border border-moss-500/20 bg-moss-500/10 px-4 py-3 text-sm text-moss-500">
                        {{ session('success') }}
                    </div>
                @endif

                @if (session('error'))
                    <div class="mb-6 rounded-2xl border border-clay-500/20 bg-clay-500/10 px-4 py-3 text-sm text-clay-600">
                        {{ session('error') }}
                    </div>
                @endif

                {{ $slot }}
            </main>
        </div>
        <x-impersonate::banner/>

        @include('cookie-consent::index')
        @livewireScripts
    </body>
</html>

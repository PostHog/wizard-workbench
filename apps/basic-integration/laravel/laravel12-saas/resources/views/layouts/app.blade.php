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
        @auth
        <script>
            window.posthogUser = {
                id: "{{ auth()->id() }}",
                email: "{{ auth()->user()->email }}",
                name: "{{ auth()->user()->name }}"
            };
        </script>
        @endauth
        @livewireStyles
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

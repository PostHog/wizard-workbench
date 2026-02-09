@props([
    'title' => null,
    'description' => null,
    'image' => null,
])

@php
    $brand = config('branding');
    $brandName = data_get($brand, 'name', config('app.name', 'Laravel'));
    $tagline = data_get($brand, 'tagline', '');
    $supportEmail = data_get($brand, 'support.email');
    $socialX = data_get($brand, 'social.x');
    $socialGithub = data_get($brand, 'social.github');
@endphp

<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        @php
            $navigationItems = [
                ['name' => 'Home', 'url' => route('home')],
                ['name' => 'Features', 'url' => route('features')],
                ['name' => 'Pricing', 'url' => route('pricing')],
            ];
            $navigationSchema = \App\Support\Seo::navigationSchema($navigationItems);
        @endphp
        <x-seo :title="$title" :description="$description" :image="$image" :schema="$navigationSchema" />

        <link rel="icon" href="{{ asset(data_get($brand, 'assets.favicon', 'favicon.ico')) }}" type="image/svg+xml">
        <link rel="apple-touch-icon" href="{{ asset(data_get($brand, 'assets.favicon', 'favicon.ico')) }}">
        <link rel="preconnect" href="https://fonts.bunny.net" crossorigin>
        <link rel="dns-prefetch" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=manrope:300,400,500,600,700&display=swap" rel="stylesheet" />
        <link href="https://fonts.bunny.net/css?family=space-grotesk:400,500,600,700&display=swap" rel="stylesheet" />

        @vite(['resources/css/app.css', 'resources/js/app.js'])
    </head>
    <body class="antialiased text-ink-900">
        <div class="relative isolate overflow-hidden">
            <div class="absolute inset-0 -z-10 bg-sand-50"></div>
            <div class="absolute -top-40 right-0 -z-10 h-80 w-80 rounded-full bg-[radial-gradient(circle_at_center,var(--color-clay-500),transparent_68%)] opacity-40 blur-3xl animate-float"></div>
            <div class="absolute -bottom-48 left-0 -z-10 h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(circle_at_center,var(--color-moss-500),transparent_70%)] opacity-25 blur-3xl animate-float"></div>

            <header x-data="{ open: false }" class="mx-auto w-full max-w-6xl px-6 pt-6">
                <nav class="flex items-center justify-between gap-4 rounded-full border border-sand-200 bg-white/80 px-5 py-3 shadow-sm backdrop-blur">
                    <a href="{{ route('home') }}" class="flex items-center gap-3 font-display text-lg tracking-tight">
                        <span class="flex h-9 w-9 items-center justify-center rounded-full bg-ink-900 text-white">
                            {{ strtoupper(substr($brandName, 0, 1)) }}
                        </span>
                        <span>{{ $brandName }}</span>
                    </a>

                    <div class="hidden items-center gap-8 text-sm font-medium text-ink-700 md:flex">
                        <a href="{{ route('features') }}" class="transition hover:text-ink-900">Features</a>
                        <a href="{{ route('pricing') }}" class="transition hover:text-ink-900">Pricing</a>
                        <a href="{{ route('login') }}" class="transition hover:text-ink-900">Sign in</a>
                    </div>

                    <div class="hidden items-center gap-3 md:flex">
                        <a href="{{ route('register') }}" class="rounded-full bg-ink-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-ink-700">
                            Get started
                        </a>
                    </div>

                    <button @click="open = !open" class="flex h-10 w-10 items-center justify-center rounded-full border border-sand-200 bg-white/80 text-ink-700 md:hidden">
                        <span class="sr-only">Toggle navigation</span>
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </nav>

                <div x-show="open" x-transition x-cloak class="mt-4 rounded-2xl border border-sand-200 bg-white/95 p-4 text-sm font-medium text-ink-700 shadow-sm md:hidden">
                    <div class="flex flex-col gap-3">
                        <a href="{{ route('features') }}" class="transition hover:text-ink-900">Features</a>
                        <a href="{{ route('pricing') }}" class="transition hover:text-ink-900">Pricing</a>
                        <a href="{{ route('login') }}" class="transition hover:text-ink-900">Sign in</a>
                        <a href="{{ route('register') }}" class="mt-2 inline-flex justify-center rounded-full bg-ink-900 px-4 py-2 text-sm font-semibold text-white">
                            Get started
                        </a>
                    </div>
                </div>
            </header>

            <main class="mx-auto w-full max-w-6xl px-6">
                {{ $slot }}
            </main>

            <footer class="mx-auto w-full max-w-6xl px-6 pb-12 pt-16">
                <div class="grid gap-10 border-t border-sand-200 pt-10 md:grid-cols-[1.4fr_1fr_1fr]">
                    <div class="space-y-4">
                        <div class="flex items-center gap-3 font-display text-lg">
                            <span class="flex h-9 w-9 items-center justify-center rounded-full bg-ink-900 text-white">
                                {{ strtoupper(substr($brandName, 0, 1)) }}
                            </span>
                            <span>{{ $brandName }}</span>
                        </div>
                        <p class="max-w-sm text-sm text-ink-700">
                            {{ $tagline }}
                        </p>
                    </div>
                    <div class="space-y-3 text-sm text-ink-700">
                        <p class="font-semibold text-ink-900">Product</p>
                        <a href="{{ route('features') }}" class="block transition hover:text-ink-900">Features</a>
                        <a href="{{ route('pricing') }}" class="block transition hover:text-ink-900">Pricing</a>
                        <a href="{{ route('register') }}" class="block transition hover:text-ink-900">Get started</a>
                    </div>
                    <div class="space-y-3 text-sm text-ink-700">
                        <p class="font-semibold text-ink-900">Connect</p>
                        @if ($supportEmail)
                            <a href="mailto:{{ $supportEmail }}" class="block transition hover:text-ink-900">{{ $supportEmail }}</a>
                        @endif
                        @if ($socialX)
                            <a href="https://x.com/{{ ltrim($socialX, '@') }}" class="block transition hover:text-ink-900">X / Twitter</a>
                        @endif
                        @if ($socialGithub)
                            <a href="{{ $socialGithub }}" class="block transition hover:text-ink-900">GitHub</a>
                        @endif
                    </div>
                </div>
                <div class="mt-8 flex flex-wrap items-center justify-between gap-3 text-xs text-ink-600">
                    <span>{{ $brandName }}. All rights reserved.</span>
                    <span>Built with Laravel 12, Livewire 3.5, Tailwind v4.</span>
                </div>
            </footer>
        </div>
    </body>
</html>

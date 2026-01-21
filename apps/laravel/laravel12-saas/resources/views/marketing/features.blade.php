@php
    $pillars = [
        [
            'title' => 'Branding and SEO from one config',
            'description' => 'Your name, logo, social metadata, and theme color live in config/branding.php and flow into every layout.',
        ],
        [
            'title' => 'Marketing pages with polish',
            'description' => 'Landing, features, and pricing pages share a design system that looks intentional on day one.',
        ],
        [
            'title' => 'Billing-ready flows',
            'description' => 'Cashier-backed checkout, swapping plans, and portal access are structured as actions.',
        ],
        [
            'title' => 'Production-ready app shell',
            'description' => 'A modern shell for authenticated users with clean navigation and consistent spacing.',
        ],
        [
            'title' => 'SEO + growth essentials',
            'description' => 'OG images, sitemap generation, robots rules, and branded emails are wired by default.',
        ],
        [
            'title' => 'Livewire + Alpine',
            'description' => 'Interactive components without the JS overhead, and a clean place to expand.',
        ],
    ];

    $stack = [
        'Laravel 12 + PHP 8.4',
        'Livewire 3.5 + Volt',
        'Tailwind CSS v4 + Alpine',
        'Cashier billing foundations',
        'Filament admin tooling',
        'Sitemap + robots automation',
    ];
@endphp

<x-marketing-layout
    title="Features"
    description="Everything you need to launch a SaaS with a clean app shell, modern marketing, and production-ready structure."
>
    <section class="pb-16 pt-14">
        <div class="flex flex-col gap-6">
            <p class="text-sm font-semibold uppercase tracking-[0.2em] text-ink-600">Features</p>
            <h1 class="text-balance text-4xl font-semibold text-ink-900 md:text-5xl">
                A starter kit that feels like a product, not a scaffold.
            </h1>
            <p class="max-w-2xl text-lg text-ink-700">
                Every layer, from marketing pages to app flows, is designed to reduce setup time while keeping
                your codebase calm and scalable.
            </p>
        </div>
    </section>

    <section class="pb-16">
        <div class="grid gap-6 lg:grid-cols-3">
            @foreach ($pillars as $pillar)
                <div class="rounded-3xl border border-sand-200 bg-white/80 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                    <h3 class="text-lg font-semibold text-ink-900">{{ $pillar['title'] }}</h3>
                    <p class="mt-3 text-sm text-ink-700">{{ $pillar['description'] }}</p>
                </div>
            @endforeach
        </div>
    </section>

    <section class="pb-20">
        <div class="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <div class="rounded-[2.5rem] border border-sand-200 bg-white/80 p-8 shadow-sm">
                <p class="text-sm font-semibold uppercase tracking-[0.2em] text-ink-600">Stack</p>
                <h2 class="mt-4 text-3xl font-semibold text-ink-900">Modern defaults without the bloat.</h2>
                <p class="mt-4 text-ink-700">
                    Use the tools you already love with the ergonomics you want. Everything ships with sensible
                    defaults so you can move fast.
                </p>
            </div>
            <div class="grid gap-4">
                @foreach ($stack as $item)
                    <div class="flex items-center justify-between rounded-2xl border border-sand-200 bg-white/80 px-5 py-4 text-sm font-medium text-ink-700">
                        <span>{{ $item }}</span>
                        <span class="h-2.5 w-2.5 rounded-full bg-clay-500"></span>
                    </div>
                @endforeach
            </div>
        </div>
    </section>

    <section class="pb-24">
        <div class="rounded-[2.5rem] border border-ink-900/10 bg-ink-900 px-10 py-12 text-white">
            <div class="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div class="space-y-3">
                    <h2 class="text-3xl font-semibold">Build the next iteration this week.</h2>
                    <p class="max-w-xl text-white/70">
                        Skip the boilerplate. Start with a kit that already feels like a shipped product.
                    </p>
                </div>
                <div class="flex flex-wrap gap-4">
                    <a href="{{ route('register') }}" class="rounded-full bg-white px-6 py-3 text-sm font-semibold text-ink-900">
                        Get started
                    </a>
                    <a href="{{ route('pricing') }}" class="rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white">
                        View pricing
                    </a>
                </div>
            </div>
        </div>
    </section>
</x-marketing-layout>

@php
    $highlights = [
        [
            'title' => 'Config-driven branding + SEO',
            'description' => 'Update name, logos, social cards, and meta defaults in one place and ship consistent pages everywhere.',
        ],
        [
            'title' => 'Billing built for production',
            'description' => 'Cashier-ready flows, swap logic, and billing portal entry points are wired to actions.',
        ],
        [
            'title' => 'Domain-first structure',
            'description' => 'Domains, actions, and support utilities keep your product clean as it grows.',
        ],
    ];

    $workflow = [
        [
            'title' => 'Customize the brand',
            'description' => 'Edit config/branding.php to set your logo, colors, and default SEO metadata.',
        ],
        [
            'title' => 'Pick a billing path',
            'description' => 'Use Cashier plans or swap in your own pricing tiers without touching views.',
        ],
        [
            'title' => 'Launch with confidence',
            'description' => 'Marketing pages, app shell, sitemap, robots, and OG images are ready on day one.',
        ],
    ];

    $tiers = [
        [
            'name' => 'Starter',
            'price' => '$39',
            'details' => 'For solo founders validating',
            'features' => ['Unlimited draft pages', 'Brand + SEO config', 'Stripe checkout'],
        ],
        [
            'name' => 'Growth',
            'price' => '$129',
            'details' => 'For teams shipping fast',
            'features' => ['Team seats', 'Usage metering ready', 'Priority support'],
        ],
        [
            'name' => 'Scale',
            'price' => '$289',
            'details' => 'For mature SaaS teams',
            'features' => ['Dedicated onboarding', 'SLA support', 'Custom domains'],
        ],
    ];
@endphp

<x-marketing-layout
    title="Launch your SaaS in days"
    description="A next-gen Laravel starter kit with Livewire, Tailwind v4, and a production-ready structure."
>
    <section class="pb-20 pt-14">
        <div class="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
            <div class="space-y-6">
                <div class="inline-flex items-center gap-2 rounded-full border border-sand-200 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-ink-600">
                    Laravel 12 + Livewire 3.5 + Tailwind v4
                </div>
                <h1 class="text-balance text-4xl font-semibold leading-tight text-ink-900 md:text-6xl animate-fade-up">
                    Launch your SaaS like a product team, not a weekend hack.
                </h1>
                <p class="max-w-xl text-lg text-ink-700 animate-fade-up" style="animation-delay: 0.08s;">
                    A plug-and-play starter kit that ships with a polished marketing site, a clean app shell,
                    billing flows, and a config-driven brand + SEO system.
                </p>
                <div class="flex flex-wrap items-center gap-4 animate-fade-up" style="animation-delay: 0.16s;">
                    <a href="{{ route('register') }}" class="rounded-full bg-ink-900 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-ink-900/15 transition hover:bg-ink-700">
                        Start building
                    </a>
                    <a href="{{ route('features') }}" class="rounded-full border border-ink-900/15 bg-white/80 px-6 py-3 text-sm font-semibold text-ink-900 transition hover:border-ink-900/30">
                        Explore features
                    </a>
                </div>
                <div class="flex flex-wrap gap-6 text-sm text-ink-600">
                    <div class="flex items-center gap-2">
                        <span class="h-2.5 w-2.5 rounded-full bg-moss-500"></span>
                        Laravel 12 + PHP 8.4
                    </div>
                    <div class="flex items-center gap-2">
                        <span class="h-2.5 w-2.5 rounded-full bg-clay-500"></span>
                        Cashier + Stripe ready
                    </div>
                    <div class="flex items-center gap-2">
                        <span class="h-2.5 w-2.5 rounded-full bg-ink-600"></span>
                        Config-first branding
                    </div>
                </div>
            </div>

            <div class="relative">
                <div class="absolute -left-6 top-8 h-40 w-40 rounded-full border border-sand-200 bg-white/70 shadow-lg"></div>
                <div class="relative rounded-3xl border border-sand-200 bg-white/90 p-6 shadow-2xl shadow-ink-900/10 animate-fade-in">
                    <div class="flex items-center justify-between">
                        <div class="text-sm font-semibold text-ink-900">App Shell</div>
                        <span class="rounded-full bg-moss-500/10 px-3 py-1 text-xs font-semibold text-moss-500">Live</span>
                    </div>
                    <div class="mt-6 space-y-4">
                        <div class="rounded-2xl border border-sand-200 bg-sand-50 px-4 py-3">
                            <p class="text-xs uppercase tracking-[0.18em] text-ink-600">Monthly Recurring</p>
                            <p class="mt-2 text-2xl font-semibold text-ink-900">$48,920</p>
                        </div>
                        <div class="grid gap-4 md:grid-cols-2">
                            <div class="rounded-2xl border border-sand-200 bg-white px-4 py-3">
                                <p class="text-xs uppercase tracking-[0.18em] text-ink-600">Active Trials</p>
                                <p class="mt-2 text-xl font-semibold text-ink-900">412</p>
                            </div>
                            <div class="rounded-2xl border border-sand-200 bg-white px-4 py-3">
                                <p class="text-xs uppercase tracking-[0.18em] text-ink-600">Activation</p>
                                <p class="mt-2 text-xl font-semibold text-ink-900">68%</p>
                            </div>
                        </div>
                        <div class="rounded-2xl border border-sand-200 bg-ink-900 px-4 py-3 text-white">
                            <p class="text-xs uppercase tracking-[0.18em] text-white/70">Next actions</p>
                            <p class="mt-2 text-sm">Review churn, trigger win-back, and deploy in minutes.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section class="pb-20">
        <div class="grid gap-6 lg:grid-cols-3">
            @foreach ($highlights as $highlight)
                <div class="rounded-3xl border border-sand-200 bg-white/80 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                    <h3 class="text-lg font-semibold text-ink-900">{{ $highlight['title'] }}</h3>
                    <p class="mt-3 text-sm text-ink-700">{{ $highlight['description'] }}</p>
                </div>
            @endforeach
        </div>
    </section>

    <section class="pb-20">
        <div class="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <div class="space-y-4">
                <p class="text-sm font-semibold uppercase tracking-[0.2em] text-ink-600">How it works</p>
                <h2 class="text-balance text-3xl font-semibold text-ink-900 md:text-4xl">
                    A clean workflow for teams who ship weekly.
                </h2>
                <p class="text-ink-700">
                    Everything is organized around domains and actions, so adding a new module is a matter of
                    extending intent instead of spelunking for helpers.
                </p>
            </div>
            <div class="space-y-4">
                @foreach ($workflow as $step)
                    <div class="rounded-2xl border border-sand-200 bg-white/80 p-5">
                        <h3 class="text-base font-semibold text-ink-900">{{ $step['title'] }}</h3>
                        <p class="mt-2 text-sm text-ink-700">{{ $step['description'] }}</p>
                    </div>
                @endforeach
            </div>
        </div>
    </section>

    <section class="pb-20">
        <div class="rounded-[2.5rem] border border-sand-200 bg-white/80 p-10 shadow-sm">
            <div class="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div class="space-y-3">
                    <p class="text-sm font-semibold uppercase tracking-[0.2em] text-ink-600">Pricing</p>
                    <h2 class="text-3xl font-semibold text-ink-900">Clear tiers that map to your Stripe plans.</h2>
                </div>
                <a href="{{ route('pricing') }}" class="rounded-full border border-ink-900/15 bg-white px-5 py-2 text-sm font-semibold text-ink-900 transition hover:border-ink-900/30">
                    View full pricing
                </a>
            </div>
            <div class="mt-8 grid gap-6 lg:grid-cols-3">
                @foreach ($tiers as $tier)
                    <div class="rounded-3xl border border-sand-200 bg-white p-6 shadow-sm">
                        <div class="flex items-center justify-between">
                            <h3 class="text-lg font-semibold text-ink-900">{{ $tier['name'] }}</h3>
                            <span class="text-2xl font-semibold text-ink-900">{{ $tier['price'] }}</span>
                        </div>
                        <p class="mt-2 text-sm text-ink-600">{{ $tier['details'] }}</p>
                        <ul class="mt-4 space-y-2 text-sm text-ink-700">
                            @foreach ($tier['features'] as $feature)
                                <li class="flex items-center gap-2">
                                    <span class="h-1.5 w-1.5 rounded-full bg-clay-500"></span>
                                    {{ $feature }}
                                </li>
                            @endforeach
                        </ul>
                    </div>
                @endforeach
            </div>
        </div>
    </section>

    <section class="pb-24">
        <div class="rounded-[2.5rem] border border-ink-900/10 bg-ink-900 px-10 py-12 text-white">
            <div class="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div class="space-y-3">
                    <h2 class="text-3xl font-semibold">Ready to ship your next product?</h2>
                    <p class="max-w-xl text-white/70">
                        Plug in your brand settings, connect Stripe, and focus on the features your customers want.
                    </p>
                </div>
                <div class="flex flex-wrap gap-4">
                    <a href="{{ route('register') }}" class="rounded-full bg-white px-6 py-3 text-sm font-semibold text-ink-900">
                        Start building
                    </a>
                    <a href="{{ route('login') }}" class="rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white">
                        Talk to sales
                    </a>
                </div>
            </div>
        </div>
    </section>
</x-marketing-layout>

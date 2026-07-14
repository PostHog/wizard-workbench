@php
    $tiers = [
        [
            'name' => 'Starter',
            'price' => '$39',
            'period' => '/month',
            'description' => 'For solo founders validating new products.',
            'cta' => 'Start with Starter',
            'href' => route('register'),
            'features' => [
                'Unlimited marketing pages',
                'Config-driven branding',
                'Cashier checkout flows',
                'Email + OG templates',
            ],
        ],
        [
            'name' => 'Growth',
            'price' => '$129',
            'period' => '/month',
            'description' => 'For teams scaling their first revenue.',
            'cta' => 'Choose Growth',
            'href' => route('register'),
            'highlight' => true,
            'features' => [
                'Team-ready app shell',
                'Action-based billing logic',
                'Sitemap + robots automation',
                'Priority setup support',
            ],
        ],
        [
            'name' => 'Scale',
            'price' => '$289',
            'period' => '/month',
            'description' => 'For mature SaaS teams who need flexibility.',
            'cta' => 'Talk to sales',
            'href' => route('login'),
            'features' => [
                'Custom domain structure',
                'Dedicated onboarding',
                'Advanced SEO presets',
                'Strategic roadmap review',
            ],
        ],
    ];
@endphp

<x-marketing-layout
    title="Pricing"
    description="Simple, transparent tiers designed to map cleanly to your Cashier plans."
>
    <section class="pb-16 pt-14">
        <div class="space-y-5">
            <p class="text-sm font-semibold uppercase tracking-[0.2em] text-ink-600">Pricing</p>
            <h1 class="text-balance text-4xl font-semibold text-ink-900 md:text-5xl">
                Pricing that scales with your product.
            </h1>
            <p class="max-w-2xl text-lg text-ink-700">
                Each tier maps cleanly to a Stripe price. Swap plans, manage billing, and upgrade without
                rewriting views.
            </p>
        </div>
    </section>

    <section class="pb-20">
        <div class="grid gap-6 lg:grid-cols-3">
            @foreach ($tiers as $tier)
                <div class="rounded-3xl border border-sand-200 bg-white p-6 shadow-sm {{ !empty($tier['highlight']) ? 'ring-2 ring-ink-900/10' : '' }}">
                    <div class="flex items-center justify-between">
                        <h2 class="text-lg font-semibold text-ink-900">{{ $tier['name'] }}</h2>
                        @if (!empty($tier['highlight']))
                            <span class="rounded-full bg-clay-500/15 px-3 py-1 text-xs font-semibold text-clay-600">Most popular</span>
                        @endif
                    </div>
                    <div class="mt-4 flex items-end gap-2">
                        <span class="text-3xl font-semibold text-ink-900">{{ $tier['price'] }}</span>
                        <span class="text-sm text-ink-600">{{ $tier['period'] }}</span>
                    </div>
                    <p class="mt-3 text-sm text-ink-700">{{ $tier['description'] }}</p>
                    <a href="{{ $tier['href'] }}" class="mt-6 inline-flex w-full justify-center rounded-full bg-ink-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-ink-700" data-ph-event="pricing_cta_clicked" data-ph-plan="{{ $tier['name'] }}" data-ph-destination="{{ str_contains($tier['href'], route('register', absolute: false)) ? 'register' : 'login' }}">
                        {{ $tier['cta'] }}
                    </a>
                    <ul class="mt-6 space-y-2 text-sm text-ink-700">
                        @foreach ($tier['features'] as $feature)
                            <li class="flex items-center gap-2">
                                <span class="h-1.5 w-1.5 rounded-full bg-moss-500"></span>
                                {{ $feature }}
                            </li>
                        @endforeach
                    </ul>
                </div>
            @endforeach
        </div>
    </section>

    <section class="pb-24">
        <div class="rounded-[2.5rem] border border-ink-900/10 bg-ink-900 px-10 py-12 text-white">
            <div class="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div class="space-y-3">
                    <h2 class="text-3xl font-semibold">Need a bespoke rollout?</h2>
                    <p class="max-w-xl text-white/70">
                        We can help tailor onboarding, migrations, and launch strategy for larger teams.
                    </p>
                </div>
                <div class="flex flex-wrap gap-4">
                    <a href="{{ route('register') }}" class="rounded-full bg-white px-6 py-3 text-sm font-semibold text-ink-900" data-ph-event="marketing_cta_clicked" data-ph-location="pricing_footer" data-ph-destination="register">
                        Get started
                    </a>
                    <a href="{{ route('login') }}" class="rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white" data-ph-event="marketing_cta_clicked" data-ph-location="pricing_footer" data-ph-destination="login">
                        Contact sales
                    </a>
                </div>
            </div>
        </div>
    </section>
</x-marketing-layout>

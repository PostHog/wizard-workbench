<div>
    <div class="rounded-3xl border border-sand-200 bg-white/80 p-8 shadow-sm">
        @if($subscribed)
            <p class="text-sm font-semibold uppercase tracking-[0.2em] text-ink-600">Subscription</p>
            <p class="mt-3 text-xl font-semibold text-ink-900">You are on the {{ $plan }} plan.</p>
            <p class="mt-2 text-sm text-ink-700">Upgrade, downgrade, or cancel anytime from the billing portal.</p>
            <a href="{{ route('billing-portal') }}" class="mt-6 inline-flex rounded-full bg-ink-900 px-5 py-2 text-sm font-semibold text-white">
                Manage subscription
            </a>
        @else
            <p class="text-sm font-semibold uppercase tracking-[0.2em] text-ink-600">Subscription</p>
            <p class="mt-3 text-xl font-semibold text-ink-900">You are not subscribed yet.</p>
            <p class="mt-2 text-sm text-ink-700">Choose a plan to unlock billing, usage, and revenue tracking.</p>
            <a href="{{ route('subscribe') }}" class="mt-6 inline-flex rounded-full bg-ink-900 px-5 py-2 text-sm font-semibold text-white">
                Subscribe now
            </a>
        @endif
    </div>
</div>

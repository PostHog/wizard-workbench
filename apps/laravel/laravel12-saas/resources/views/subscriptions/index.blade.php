<x-app-layout title="Subscription Plans">
    <div class="mb-6 flex items-center justify-between">
        <div>
            <p class="text-sm font-semibold uppercase tracking-[0.2em] text-ink-600">Billing</p>
            <h1 class="text-3xl font-semibold text-ink-900">Choose the plan that fits.</h1>
        </div>
        @if ($hasActiveSubscription)
            <a href="{{ route('billing-portal') }}" target="_blank" class="rounded-full border border-ink-900/15 bg-white px-4 py-2 text-sm font-semibold text-ink-900">
                Open billing portal
            </a>
        @endif
    </div>

    <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        @foreach ($plans as $plan)
            <div class="rounded-3xl border border-sand-200 bg-white/80 p-6 shadow-sm">
                <div class="flex items-center justify-between">
                    <h3 class="text-xl font-semibold text-ink-900">{{ $plan->name }}</h3>
                    @if ($currentPlan == $plan->stripe_plan_id)
                        <span class="rounded-full bg-moss-500/15 px-3 py-1 text-xs font-semibold text-moss-500">Active</span>
                    @endif
                </div>
                <p class="mt-4 text-4xl font-semibold text-ink-900">${{ $plan->price }}<span class="text-sm text-ink-600">/month</span></p>
                <p class="mt-3 text-sm text-ink-700">{{ $plan->description }}</p>
                @if (is_array($plan->features) && count($plan->features) > 0)
                    <ul class="mt-4 space-y-2 text-sm text-ink-700">
                        @foreach ($plan->features as $feature)
                            @if (isset($feature['feature_name']))
                                <li class="flex items-center gap-2">
                                    <span class="h-1.5 w-1.5 rounded-full bg-clay-500"></span>
                                    {{ $feature['feature_name'] }}
                                </li>
                            @endif
                        @endforeach
                    </ul>
                @endif
                <div class="mt-6">
                    @if (! $hasActiveSubscription)
                        <form action="{{ route('checkout') }}" method="POST">
                            @csrf
                            <input type="hidden" name="plan" value="{{ $plan->id }}">
                            <button type="submit" class="w-full rounded-full bg-ink-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-ink-700">
                                Subscribe
                            </button>
                        </form>
                    @elseif ($currentPlan == $plan->stripe_plan_id)
                        <button class="w-full cursor-not-allowed rounded-full border border-sand-200 bg-sand-100 px-4 py-2 text-sm font-semibold text-ink-600">
                            Current plan
                        </button>
                    @else
                        @php
                            $swapLabel = $currentPlanPrice !== null
                                ? ($plan->price > $currentPlanPrice ? 'Upgrade' : 'Downgrade')
                                : 'Change plan';
                        @endphp
                        <button class="w-full rounded-full border border-ink-900/15 bg-white px-4 py-2 text-sm font-semibold text-ink-900 transition hover:border-ink-900/30" onclick="showSwapModal('{{ $plan->id }}', '{{ $plan->name }}', {{ $plan->price }})">
                            {{ $swapLabel }}
                        </button>
                    @endif
                </div>
            </div>
        @endforeach
    </div>

    <dialog id="swap_modal" class="backdrop:bg-ink-900/30">
        <div class="mx-auto w-full max-w-md rounded-3xl border border-sand-200 bg-white p-6 shadow-xl">
            <h3 class="text-lg font-semibold text-ink-900">Confirm plan change</h3>
            <p class="mt-3 text-sm text-ink-700">Switch to the <span id="new_plan_name" class="font-semibold text-ink-900"></span> plan?</p>
            <p class="mt-2 text-sm text-ink-600">New price: $<span id="new_plan_price"></span>/month</p>
            <div class="mt-6 flex flex-wrap gap-3">
                <form action="{{ route('swap') }}" method="POST">
                    @csrf
                    <input type="hidden" name="plan" id="new_plan_id">
                    <button type="submit" class="rounded-full bg-ink-900 px-4 py-2 text-sm font-semibold text-white">
                        Confirm
                    </button>
                </form>
                <form method="dialog">
                    <button class="rounded-full border border-ink-900/15 bg-white px-4 py-2 text-sm font-semibold text-ink-900">
                        Cancel
                    </button>
                </form>
            </div>
        </div>
    </dialog>

    <script>
        function showSwapModal(planId, planName, planPrice) {
            document.getElementById('new_plan_id').value = planId;
            document.getElementById('new_plan_name').textContent = planName;
            document.getElementById('new_plan_price').textContent = planPrice;
            swap_modal.showModal();
        }
    </script>
</x-app-layout>

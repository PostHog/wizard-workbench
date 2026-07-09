@php
    $user = auth()->user();

    if ($user) {
        app(\App\Services\PostHogService::class)->capture($user->getPostHogDistinctId(), 'profile_viewed', [
            'email_verified' => $user->hasVerifiedEmail(),
            'has_social_account' => filled($user->provider),
        ]);
    }
@endphp

<x-app-layout title="Settings">
    <div class="mb-6">
        <p class="text-sm font-semibold uppercase tracking-[0.2em] text-ink-600">Account</p>
        <h1 class="text-3xl font-semibold text-ink-900">{{ __('Profile') }}</h1>
    </div>
    <div class="space-y-6">
        <div class="rounded-3xl border border-sand-200 bg-white/80 p-6 shadow-sm">
            <div class="max-w-xl">
                <livewire:profile.update-profile-information-form />
            </div>
        </div>

        <div class="rounded-3xl border border-sand-200 bg-white/80 p-6 shadow-sm">
            <div class="max-w-xl">
                <livewire:profile.update-password-form />
            </div>
        </div>

        <div class="rounded-3xl border border-sand-200 bg-white/80 p-6 shadow-sm">
            <div class="max-w-xl">
                <livewire:profile.delete-user-form />
            </div>
        </div>
    </div>
</x-app-layout>

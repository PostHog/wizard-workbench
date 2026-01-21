<?php

use App\Livewire\Actions\Logout;
use Livewire\Volt\Component;

new class extends Component {
    public $isSubscribed = false;

    public function mount(): void
    {
        $this->isSubscribed = auth()->user()->subscribed();
    }

    /**
     * Log the current user out of the application.
     */
    public function logout(Logout $logout): void
    {
        $logout();

        $this->redirect('/', navigate: true);
    }
}; ?>

<div class="rounded-3xl border border-sand-200 bg-white/80 px-6 py-4 shadow-sm">
    <div class="flex items-center justify-between gap-6">
        <div class="flex items-center gap-4">
            <a href="{{ route('dashboard') }}" wire:navigate class="flex items-center gap-3 font-display text-lg text-ink-900">
                <span class="flex h-9 w-9 items-center justify-center rounded-full bg-ink-900 text-white">
                    {{ strtoupper(substr(config('branding.name', 'M'), 0, 1)) }}
                </span>
                <span>{{ config('branding.name', 'MVPstarter') }}</span>
            </a>
            <div class="hidden items-center gap-4 text-sm font-medium text-ink-600 md:flex">
                <a href="{{ route('dashboard') }}" wire:navigate class="transition hover:text-ink-900">Dashboard</a>
                <a href="{{ route('subscribe') }}" wire:navigate class="transition hover:text-ink-900">Plans</a>
            </div>
        </div>

        <div x-data="{ open: false }" class="relative">
            <button @click="open = !open" class="flex items-center gap-3 rounded-full border border-sand-200 bg-white/80 px-3 py-2 text-sm font-medium text-ink-700 transition hover:text-ink-900">
                <span class="hidden text-sm md:block">{{ auth()->user()->name }}</span>
                <span class="h-9 w-9 overflow-hidden rounded-full">
                    <img alt="{{ auth()->user()->name }}"
                        src="https://ui-avatars.com/api/?name={{ urlencode(auth()->user()->name) }}&color=FFFFFF&background=0b1220" />
                </span>
            </button>

            <div x-show="open" x-transition x-cloak @click.outside="open = false" class="absolute right-0 mt-3 w-56 rounded-2xl border border-sand-200 bg-white p-2 text-sm text-ink-700 shadow-xl">
                <a href="{{ route('profile') }}" wire:navigate class="block rounded-xl px-3 py-2 transition hover:bg-sand-100">Settings</a>
                @if (str_ends_with(auth()->user()->email, '@mvpable.com'))
                    <a href="/admin" class="block rounded-xl px-3 py-2 transition hover:bg-sand-100">Admin panel</a>
                @endif
                @if ($isSubscribed)
                    <a href="{{ route('billing-portal') }}" target="_blank" class="block rounded-xl px-3 py-2 transition hover:bg-sand-100">Billing portal</a>
                @endif
                <button wire:click="logout" class="mt-1 w-full rounded-xl px-3 py-2 text-left transition hover:bg-sand-100">
                    Logout
                </button>
            </div>
        </div>
    </div>
</div>

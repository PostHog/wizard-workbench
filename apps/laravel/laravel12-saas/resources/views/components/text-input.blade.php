@props(['disabled' => false])

<input
    {{ $disabled ? 'disabled' : '' }}
    {!! $attributes->merge(['class' => 'mt-1 w-full rounded-2xl border border-sand-200 bg-white/80 px-4 py-2 text-sm text-ink-900 shadow-sm placeholder:text-ink-600/60 focus:border-ink-900/30 focus:outline-none focus:ring-2 focus:ring-ink-900/10 disabled:cursor-not-allowed disabled:opacity-70']) !!}
>

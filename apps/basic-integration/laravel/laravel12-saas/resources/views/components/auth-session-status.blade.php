@props(['status'])

@if ($status)
    <div {{ $attributes->merge(['class' => 'rounded-2xl border border-moss-500/20 bg-moss-500/10 px-4 py-3 text-sm text-moss-500']) }}>
        {{ $status }}
    </div>
@endif

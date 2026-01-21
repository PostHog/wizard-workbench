@props(['active'])

@php
$classes = ($active ?? false)
            ? 'block w-full ps-3 pe-4 py-2 border-l-4 border-ink-900 text-start text-base font-medium text-ink-900 bg-sand-100 focus:outline-none focus:text-ink-900 focus:bg-sand-100 focus:border-ink-900 transition duration-150 ease-in-out'
            : 'block w-full ps-3 pe-4 py-2 border-l-4 border-transparent text-start text-base font-medium text-ink-600 hover:text-ink-900 hover:bg-sand-50 hover:border-ink-900/30 focus:outline-none focus:text-ink-900 focus:bg-sand-50 focus:border-ink-900/30 transition duration-150 ease-in-out';
@endphp

<a {{ $attributes->merge(['class' => $classes]) }}>
    {{ $slot }}
</a>

@props(['active'])

@php
$classes = ($active ?? false)
            ? 'inline-flex items-center px-1 pt-1 border-b-2 border-ink-900 text-sm font-medium leading-5 text-ink-900 focus:outline-none focus:border-ink-900 transition duration-150 ease-in-out'
            : 'inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium leading-5 text-ink-600 hover:text-ink-900 hover:border-ink-900/30 focus:outline-none focus:text-ink-900 focus:border-ink-900/30 transition duration-150 ease-in-out';
@endphp

<a {{ $attributes->merge(['class' => $classes]) }}>
    {{ $slot }}
</a>

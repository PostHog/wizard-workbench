@props(['value'])

<label {{ $attributes->merge(['class' => 'block text-sm font-semibold text-ink-700']) }}>
    {{ $value ?? $slot }}
</label>

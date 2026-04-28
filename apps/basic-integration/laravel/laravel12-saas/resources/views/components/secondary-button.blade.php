<button {{ $attributes->merge(['type' => 'button', 'class' => 'inline-flex items-center justify-center rounded-full border border-ink-900/15 bg-white px-5 py-2 text-sm font-semibold text-ink-900 transition hover:border-ink-900/30 focus:outline-none focus:ring-2 focus:ring-ink-900/20 disabled:opacity-50']) }}>
    {{ $slot }}
</button>

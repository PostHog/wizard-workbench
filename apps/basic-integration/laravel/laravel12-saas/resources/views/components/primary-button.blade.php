<button {{ $attributes->merge(['type' => 'submit', 'class' => 'inline-flex items-center justify-center rounded-full bg-ink-900 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-ink-700 focus:outline-none focus:ring-2 focus:ring-ink-900/20']) }}>
    {{ $slot }}
</button>

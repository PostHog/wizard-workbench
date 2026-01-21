@php
    $brand = config('branding');
    $name = data_get($brand, 'name', config('app.name', 'MVPstarter'));
    $tagline = data_get($brand, 'tagline', 'Launch your SaaS in days.');
    $theme = data_get($brand, 'theme_color', '#0b1220');
@endphp
<svg width="1200" height="630" viewBox="0 0 1200 630" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#f8f4ee"/>
            <stop offset="100%" stop-color="#efe7dc"/>
        </linearGradient>
        <linearGradient id="accent" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="{{ $theme }}"/>
            <stop offset="100%" stop-color="#e07a3f"/>
        </linearGradient>
    </defs>
    <rect width="1200" height="630" fill="url(#bg)"/>
    <circle cx="1030" cy="120" r="140" fill="url(#accent)" opacity="0.18"/>
    <circle cx="160" cy="520" r="180" fill="#2b8a6e" opacity="0.14"/>
    <rect x="90" y="140" width="1020" height="350" rx="36" fill="#ffffff" opacity="0.85"/>
    <g>
        <rect x="140" y="200" width="70" height="70" rx="22" fill="url(#accent)"/>
        <text x="235" y="245" font-family="Space Grotesk, Manrope, sans-serif" font-size="46" font-weight="600" fill="#0b1220">{{ $name }}</text>
        <text x="235" y="300" font-family="Manrope, sans-serif" font-size="26" fill="#223047">{{ $tagline }}</text>
    </g>
    <text x="140" y="390" font-family="Manrope, sans-serif" font-size="20" fill="#2e405a">Laravel 12 - Livewire 3.5 - Tailwind v4</text>
</svg>

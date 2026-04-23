<?php

return [
    'name' => env('BRAND_NAME', env('APP_NAME', 'MVPstarter')),
    'legal_name' => env('BRAND_LEGAL_NAME', env('BRAND_NAME', env('APP_NAME', 'MVPstarter')).' Inc.'),
    'tagline' => env('BRAND_TAGLINE', 'Ship a SaaS in days, not weeks.'),
    'description' => env('BRAND_DESCRIPTION', 'A modern Laravel, Livewire, Tailwind starter kit with billing, marketing, and a production-ready structure.'),
    'url' => env('APP_URL', 'http://localhost'),
    'theme_color' => env('BRAND_THEME_COLOR', '#0b1220'),
    'support' => [
        'email' => env('BRAND_SUPPORT_EMAIL', 'support@example.com'),
        'phone' => env('BRAND_SUPPORT_PHONE'),
    ],
    'assets' => [
        'logo' => '/images/brand/logo.svg',
        'logo_mark' => '/images/brand/mark.svg',
        'favicon' => '/images/brand/favicon.svg',
        'og_image' => '/og/default.svg',
    ],
    'social' => [
        'x' => env('BRAND_X_HANDLE'),
        'github' => env('BRAND_GITHUB_URL'),
        'linkedin' => env('BRAND_LINKEDIN_URL'),
    ],
    'seo' => [
        'title' => env('BRAND_SEO_TITLE', env('BRAND_NAME', env('APP_NAME', 'MVPstarter'))),
        'description' => env('BRAND_SEO_DESCRIPTION', env('BRAND_DESCRIPTION', 'A modern SaaS starter kit.')),
        'keywords' => [
            'SaaS',
            'Laravel',
            'Livewire',
            'Tailwind CSS',
            'Starter Kit',
        ],
        'robots' => env('BRAND_SEO_ROBOTS', 'index,follow'),
        'twitter_card' => 'summary_large_image',
        'og_type' => 'website',
    ],
];

@props([
    'title' => null,
    'description' => null,
    'image' => null,
    'type' => null,
    'breadcrumbs' => null,
    'publishedTime' => null,
    'modifiedTime' => null,
    'author' => null,
    'schema' => null,
])

@php
    $meta = \App\Support\Seo::forPage(
        title: $title,
        description: $description,
        image: $image,
        type: $type,
        breadcrumbs: $breadcrumbs,
        publishedTime: $publishedTime,
        modifiedTime: $modifiedTime,
        author: $author
    );
    $canonical = url()->current();
    $keywords = $meta['keywords'] ?? [];
    $themeColor = data_get(config('branding'), 'theme_color', '#0b1220');
    $branding = config('branding', []);
    $locale = $meta['locale'] ?? str_replace('_', '-', app()->getLocale());

    $schemas = [];

    if ($schema) {
        $schemas[] = $schema;
    } else {
        $schemas[] = \App\Support\Seo::websiteSchema();
    }

    $schemas[] = \App\Support\Seo::organizationSchema();

    if (! empty($meta['breadcrumbs'])) {
        $schemas[] = \App\Support\Seo::breadcrumbSchema($meta['breadcrumbs']);
    }

    if ($meta['type'] === 'article' && $title) {
        $schemas[] = \App\Support\Seo::articleSchema(
            headline: $title,
            description: $meta['description'],
            image: $meta['image'],
            publishedTime: $publishedTime,
            modifiedTime: $modifiedTime,
            author: $meta['author']
        );
    }
@endphp

<title>{{ $meta['title'] }}</title>
<meta name="description" content="{{ $meta['description'] }}">
@if (! empty($keywords))
    <meta name="keywords" content="{{ implode(', ', $keywords) }}">
@endif
<meta name="robots" content="{{ $meta['robots'] }}">
<meta name="theme-color" content="{{ $themeColor }}">
<meta name="author" content="{{ $meta['author'] }}">
<meta name="language" content="{{ $locale }}">
<link rel="canonical" href="{{ $canonical }}">

@if ($meta['type'] === 'article')
    @if (! empty($meta['published_time']))
        <meta property="article:published_time" content="{{ $meta['published_time'] }}">
    @endif
    @if (! empty($meta['modified_time']))
        <meta property="article:modified_time" content="{{ $meta['modified_time'] }}">
    @endif
    @if (! empty($meta['author']))
        <meta property="article:author" content="{{ $meta['author'] }}">
    @endif
@endif

<meta property="og:title" content="{{ $meta['title'] }}">
<meta property="og:description" content="{{ $meta['description'] }}">
<meta property="og:type" content="{{ $meta['type'] }}">
<meta property="og:url" content="{{ $canonical }}">
<meta property="og:site_name" content="{{ $meta['site_name'] }}">
<meta property="og:locale" content="{{ $locale }}">
@if (! empty($meta['image']))
    <meta property="og:image" content="{{ $meta['image'] }}">
    <meta property="og:image:secure_url" content="{{ $meta['image'] }}">
    <meta property="og:image:type" content="image/png">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:image:alt" content="{{ $meta['title'] }}">
@endif

<meta name="twitter:card" content="{{ $meta['twitter_card'] }}">
@if (! empty($meta['twitter_site']))
    <meta name="twitter:site" content="{{ $meta['twitter_site'] }}">
    <meta name="twitter:creator" content="{{ $meta['twitter_site'] }}">
@endif
<meta name="twitter:title" content="{{ $meta['title'] }}">
<meta name="twitter:description" content="{{ $meta['description'] }}">
@if (! empty($meta['image']))
    <meta name="twitter:image" content="{{ $meta['image'] }}">
    <meta name="twitter:image:alt" content="{{ $meta['title'] }}">
@endif

@foreach ($schemas as $schemaData)
    <script type="application/ld+json">{{ json_encode($schemaData, JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT) }}</script>
@endforeach

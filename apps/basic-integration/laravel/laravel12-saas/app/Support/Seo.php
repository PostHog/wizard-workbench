<?php

namespace App\Support;

use Carbon\Carbon;

class Seo
{
    public static function defaults(): array
    {
        $branding = config('branding', []);
        $seo = $branding['seo'] ?? [];

        $siteName = (string) data_get($branding, 'name', config('app.name', 'Laravel'));
        $title = (string) ($seo['title'] ?? $siteName);
        $description = (string) ($seo['description'] ?? data_get($branding, 'description', ''));
        $image = $seo['image'] ?? data_get($branding, 'assets.og_image');
        $keywords = $seo['keywords'] ?? [];
        $twitter = data_get($branding, 'social.x');
        $locale = app()->getLocale();
        $url = config('app.url');

        return [
            'title' => $title,
            'site_name' => $siteName,
            'description' => $description,
            'image' => self::absoluteUrl($image),
            'keywords' => $keywords,
            'robots' => $seo['robots'] ?? 'index,follow',
            'type' => $seo['og_type'] ?? 'website',
            'twitter_card' => $seo['twitter_card'] ?? 'summary_large_image',
            'twitter_site' => $twitter ? self::normalizeHandle($twitter) : null,
            'locale' => str_replace('_', '-', $locale),
            'url' => $url,
            'author' => $seo['author'] ?? $siteName,
        ];
    }

    public static function forPage(
        ?string $title = null,
        ?string $description = null,
        ?string $image = null,
        ?string $type = null,
        ?array $breadcrumbs = null,
        ?Carbon $publishedTime = null,
        ?Carbon $modifiedTime = null,
        ?string $author = null
    ): array {
        $defaults = self::defaults();

        if ($title) {
            $defaults['title'] = $title.' - '.$defaults['site_name'];
        }

        if ($description) {
            $defaults['description'] = $description;
        }

        if ($image) {
            $defaults['image'] = self::absoluteUrl($image);
        }

        if ($type) {
            $defaults['type'] = $type;
        }

        if ($breadcrumbs !== null) {
            $defaults['breadcrumbs'] = $breadcrumbs;
        }

        if ($publishedTime) {
            $defaults['published_time'] = $publishedTime->toIso8601String();
        }

        if ($modifiedTime) {
            $defaults['modified_time'] = $modifiedTime->toIso8601String();
        }

        if ($author) {
            $defaults['author'] = $author;
        }

        return $defaults;
    }

    public static function absoluteUrl(?string $path): ?string
    {
        if (! $path) {
            return null;
        }

        if (str_starts_with($path, 'http://') || str_starts_with($path, 'https://')) {
            return $path;
        }

        return url($path);
    }

    public static function normalizeHandle(string $handle): string
    {
        return str_starts_with($handle, '@') ? $handle : '@'.$handle;
    }

    public static function organizationSchema(): array
    {
        $branding = config('branding', []);
        $siteName = (string) data_get($branding, 'name', config('app.name', 'Laravel'));
        $legalName = (string) data_get($branding, 'legal_name', $siteName);
        $url = config('app.url');
        $logo = self::absoluteUrl(data_get($branding, 'assets.logo'));
        $social = data_get($branding, 'social', []);

        $schema = [
            '@context' => 'https://schema.org',
            '@type' => 'Organization',
            'name' => $siteName,
            'legalName' => $legalName,
            'url' => $url,
        ];

        if ($logo) {
            $schema['logo'] = $logo;
        }

        $sameAs = [];
        if (! empty($social['x'])) {
            $sameAs[] = 'https://x.com/'.ltrim($social['x'], '@');
        }
        if (! empty($social['github'])) {
            $sameAs[] = $social['github'];
        }
        if (! empty($social['linkedin'])) {
            $sameAs[] = $social['linkedin'];
        }

        if (! empty($sameAs)) {
            $schema['sameAs'] = $sameAs;
        }

        $supportEmail = data_get($branding, 'support.email');
        if ($supportEmail) {
            $schema['contactPoint'] = [
                '@type' => 'ContactPoint',
                'email' => $supportEmail,
                'contactType' => 'customer support',
            ];
        }

        return $schema;
    }

    public static function websiteSchema(?string $searchActionUrl = null): array
    {
        $branding = config('branding', []);
        $siteName = (string) data_get($branding, 'name', config('app.name', 'Laravel'));
        $url = config('app.url');
        $description = (string) data_get($branding, 'description', '');

        $schema = [
            '@context' => 'https://schema.org',
            '@type' => 'WebSite',
            'name' => $siteName,
            'url' => $url,
        ];

        if ($description) {
            $schema['description'] = $description;
        }

        if ($searchActionUrl) {
            $schema['potentialAction'] = [
                '@type' => 'SearchAction',
                'target' => [
                    '@type' => 'EntryPoint',
                    'urlTemplate' => $searchActionUrl,
                ],
                'query-input' => 'required name=search_term_string',
            ];
        }

        return $schema;
    }

    public static function breadcrumbSchema(array $breadcrumbs): array
    {
        $items = [];
        $position = 1;

        foreach ($breadcrumbs as $crumb) {
            $items[] = [
                '@type' => 'ListItem',
                'position' => $position++,
                'name' => $crumb['name'],
                'item' => $crumb['url'],
            ];
        }

        return [
            '@context' => 'https://schema.org',
            '@type' => 'BreadcrumbList',
            'itemListElement' => $items,
        ];
    }

    public static function navigationSchema(array $navigationItems): array
    {
        $items = [];

        foreach ($navigationItems as $item) {
            $items[] = [
                '@type' => 'SiteNavigationElement',
                'name' => $item['name'],
                'url' => $item['url'],
            ];
        }

        return [
            '@context' => 'https://schema.org',
            '@type' => 'ItemList',
            'itemListElement' => $items,
        ];
    }

    public static function articleSchema(
        string $headline,
        string $description,
        ?string $image = null,
        ?Carbon $publishedTime = null,
        ?Carbon $modifiedTime = null,
        ?string $author = null
    ): array {
        $branding = config('branding', []);
        $siteName = (string) data_get($branding, 'name', config('app.name', 'Laravel'));
        $url = url()->current();

        $schema = [
            '@context' => 'https://schema.org',
            '@type' => 'Article',
            'headline' => $headline,
            'description' => $description,
            'url' => $url,
            'publisher' => self::organizationSchema(),
        ];

        if ($image) {
            $schema['image'] = self::absoluteUrl($image);
        }

        if ($publishedTime) {
            $schema['datePublished'] = $publishedTime->toIso8601String();
        }

        if ($modifiedTime) {
            $schema['dateModified'] = $modifiedTime->toIso8601String();
        }

        if ($author) {
            $schema['author'] = [
                '@type' => 'Person',
                'name' => $author,
            ];
        }

        return $schema;
    }

    public static function faqSchema(array $faqs): array
    {
        $items = [];

        foreach ($faqs as $faq) {
            $items[] = [
                '@type' => 'Question',
                'name' => $faq['question'],
                'acceptedAnswer' => [
                    '@type' => 'Answer',
                    'text' => $faq['answer'],
                ],
            ];
        }

        return [
            '@context' => 'https://schema.org',
            '@type' => 'FAQPage',
            'mainEntity' => $items,
        ];
    }
}

# SEO Implementation Guide

This document explains how to use the enhanced SEO features for Google sitelinks and SEO best practices.

> **Quick Reference**: See [SEO Quick Reference](seo-quick-reference.md) for a condensed version.

## Features

### ✅ Google Sitelinks Optimization
- **SiteNavigationElement Schema**: Automatically added to marketing pages
- **BreadcrumbList Schema**: Support for breadcrumb navigation
- **Organization Schema**: Complete organization information
- **WebSite Schema**: Enhanced with search action support

### ✅ SEO Golden Tips Implemented
- Enhanced meta tags (author, language, article metadata)
- Complete Open Graph tags (locale, image dimensions, secure URLs)
- Twitter Card optimization
- Structured data (JSON-LD) for multiple content types
- Sitemap with lastmod dates
- Improved robots.txt
- Performance optimizations (preconnect, dns-prefetch)

## Basic Usage

### Simple Page SEO

```blade
<x-seo
    title="Page Title"
    description="Page description for SEO"
/>
```

### With Custom Image

```blade
<x-seo
    title="Page Title"
    description="Page description"
    image="/images/custom-og-image.png"
/>
```

### Article/Blog Post

```blade
@php
    $publishedTime = \Carbon\Carbon::parse($post->created_at);
    $modifiedTime = \Carbon\Carbon::parse($post->updated_at);
@endphp

<x-seo
    title="{{ $post->title }}"
    description="{{ $post->excerpt }}"
    image="{{ $post->featured_image }}"
    type="article"
    :publishedTime="$publishedTime"
    :modifiedTime="$modifiedTime"
    author="{{ $post->author->name }}"
/>
```

### With Breadcrumbs

```blade
@php
    $breadcrumbs = [
        ['name' => 'Home', 'url' => route('home')],
        ['name' => 'Category', 'url' => route('category.show', $category)],
        ['name' => 'Current Page', 'url' => url()->current()],
    ];
@endphp

<x-seo
    title="Current Page"
    description="Page description"
    :breadcrumbs="$breadcrumbs"
/>
```

## Structured Data Helpers

### Organization Schema

```php
$organizationSchema = \App\Support\Seo::organizationSchema();
```

Returns complete Organization schema with:
- Name and legal name
- Logo
- Social media links (sameAs)
- Contact information

### Website Schema with Search

```php
$websiteSchema = \App\Support\Seo::websiteSchema(
    searchActionUrl: url('/search?q={search_term_string}')
);
```

### Breadcrumb Schema

```php
$breadcrumbs = [
    ['name' => 'Home', 'url' => route('home')],
    ['name' => 'Products', 'url' => route('products.index')],
    ['name' => 'Product Name', 'url' => route('products.show', $product)],
];

$breadcrumbSchema = \App\Support\Seo::breadcrumbSchema($breadcrumbs);
```

### Navigation Schema

```php
$navigationItems = [
    ['name' => 'Home', 'url' => route('home')],
    ['name' => 'Features', 'url' => route('features')],
    ['name' => 'Pricing', 'url' => route('pricing')],
];

$navigationSchema = \App\Support\Seo::navigationSchema($navigationItems);
```

### Article Schema

```php
$articleSchema = \App\Support\Seo::articleSchema(
    headline: "Article Title",
    description: "Article description",
    image: "/images/article-image.png",
    publishedTime: Carbon::parse($post->created_at),
    modifiedTime: Carbon::parse($post->updated_at),
    author: "Author Name"
);
```

### FAQ Schema

```php
$faqs = [
    ['question' => 'What is this?', 'answer' => 'This is an answer.'],
    ['question' => 'How does it work?', 'answer' => 'It works like this.'],
];

$faqSchema = \App\Support\Seo::faqSchema($faqs);
```

### Custom Schema

You can pass custom schema directly:

```blade
@php
    $customSchema = [
        '@context' => 'https://schema.org',
        '@type' => 'Product',
        'name' => 'Product Name',
        'description' => 'Product description',
        'offers' => [
            '@type' => 'Offer',
            'price' => '99.99',
            'priceCurrency' => 'USD',
        ],
    ];
@endphp

<x-seo
    title="Product Name"
    description="Product description"
    :schema="$customSchema"
/>
```

## Sitemap Generation

The sitemap is automatically generated daily. To manually generate:

```bash
php artisan sitemap:generate
```

### Adding Dynamic Pages

Edit `app/Console/Commands/GenerateSitemap.php`:

```php
// Example: Add blog posts
$posts = \App\Models\Post::where('published', true)->get();
foreach ($posts as $post) {
    $sitemap->add(
        Url::create(route('posts.show', $post))
            ->setPriority(0.8)
            ->setChangeFrequency(Url::CHANGE_FREQUENCY_WEEKLY)
            ->setLastModificationDate($post->updated_at)
    );
}
```

## Configuration

### Branding Config (`config/branding.php`)

```php
'seo' => [
    'title' => env('BRAND_SEO_TITLE', 'Your Site Name'),
    'description' => env('BRAND_SEO_DESCRIPTION', 'Your site description'),
    'keywords' => ['keyword1', 'keyword2'],
    'robots' => env('BRAND_SEO_ROBOTS', 'index,follow'),
    'twitter_card' => 'summary_large_image',
    'og_type' => 'website',
    'author' => 'Your Name', // Optional
],
```

### Environment Variables

```env
BRAND_SEO_TITLE="Your Site Name"
BRAND_SEO_DESCRIPTION="Your site description"
BRAND_SEO_ROBOTS="index,follow"
BRAND_OG_TYPE="website"
```

## Google Sitelinks Best Practices

1. **Clear Site Structure**: Use breadcrumbs on all pages
2. **Navigation Schema**: Automatically added to marketing pages
3. **Internal Linking**: Ensure important pages are linked from homepage
4. **Consistent URLs**: Use canonical URLs
5. **Sitemap**: Keep sitemap updated with lastmod dates

## Testing

### Validate Structured Data
- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Schema.org Validator](https://validator.schema.org/)

### Check Meta Tags
- View page source
- Use browser dev tools
- [Open Graph Debugger](https://www.opengraph.xyz/)

### Verify Sitemap
- Visit `/sitemap.xml`
- Submit to Google Search Console

## Performance Tips

- OG images should be 1200x630px
- Use absolute URLs for all images
- Compress images before uploading
- Keep meta descriptions under 160 characters
- Keep titles under 60 characters

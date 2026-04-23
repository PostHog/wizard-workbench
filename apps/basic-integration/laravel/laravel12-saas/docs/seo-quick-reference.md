# SEO Quick Reference

## Component Usage

### Basic
```blade
<x-seo title="Page Title" description="Description" />
```

### Article
```blade
<x-seo
    title="Article Title"
    description="Article description"
    type="article"
    :publishedTime="$publishedTime"
    :modifiedTime="$modifiedTime"
    author="Author Name"
/>
```

### With Breadcrumbs
```blade
<x-seo
    title="Page Title"
    :breadcrumbs="[
        ['name' => 'Home', 'url' => route('home')],
        ['name' => 'Current', 'url' => url()->current()],
    ]"
/>
```

## Helper Methods

```php
// Organization schema
\App\Support\Seo::organizationSchema();

// Website with search
\App\Support\Seo::websiteSchema($searchUrl);

// Breadcrumbs
\App\Support\Seo::breadcrumbSchema($breadcrumbs);

// Navigation
\App\Support\Seo::navigationSchema($navItems);

// Article
\App\Support\Seo::articleSchema($headline, $description, $image, $published, $modified, $author);

// FAQ
\App\Support\Seo::faqSchema($faqs);
```

## Google Sitelinks Checklist

✅ SiteNavigationElement schema (auto-added to marketing pages)
✅ BreadcrumbList schema (pass breadcrumbs to component)
✅ Organization schema (auto-added)
✅ WebSite schema (auto-added)
✅ Clear internal linking structure
✅ Sitemap with lastmod dates
✅ Proper robots.txt

## Meta Tags Included

- Title & Description
- Keywords
- Robots
- Author
- Language
- Canonical URL
- Open Graph (complete)
- Twitter Cards
- Theme Color
- Article metadata (when type="article")

## Structured Data Types

- Organization
- WebSite
- BreadcrumbList
- SiteNavigationElement
- Article
- FAQPage
- Custom (via schema prop)

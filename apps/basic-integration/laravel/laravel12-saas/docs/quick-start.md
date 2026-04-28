# Quick Start Guide

Get MVPable up and running in 5 minutes!

## Prerequisites Check

```bash
php -v        # Should be 8.3+
composer -v  # Should be 2.x+
node -v      # Should be 18.x+
```

## Installation

```bash
# 1. Clone and enter directory
git clone https://github.com/ismaelfi/MVPable.git
cd MVPable

# 2. Install dependencies
composer install
npm install

# 3. Set up environment
php artisan dev:setup

# 4. Build assets
npm run dev

# 5. Start server
php artisan serve
```

Visit `http://localhost:8000` 🎉

## First Steps

### 1. Configure Your Brand

Edit `config/branding.php`:

```php
'name' => 'Your SaaS Name',
'description' => 'Your amazing SaaS description',
```

### 2. Set Up SEO

See [SEO Guide](seo.md) for complete setup.

Basic usage in your Blade templates:

```blade
<x-seo title="Page Title" description="Page description" />
```

### 3. Configure Stripe (Optional)

Add to `.env`:

```env
STRIPE_KEY=pk_test_...
STRIPE_SECRET=sk_test_...
```

### 4. Access Admin Panel

Visit `/admin` and login with seeded credentials.

## Common Tasks

### Add a New Page

1. Create route in `routes/web.php`:
```php
Route::view('/about', 'about')->name('about');
```

2. Create view in `resources/views/about.blade.php`:
```blade
<x-marketing-layout title="About Us" description="Learn about us">
    <h1>About Us</h1>
</x-marketing-layout>
```

### Add SEO to Page

```blade
<x-marketing-layout
    title="About Us"
    description="Learn about our company"
>
    <!-- Your content -->
</x-marketing-layout>
```

### Generate Sitemap

```bash
php artisan sitemap:generate
```

## Next Steps

- [Full Installation Guide](installation.md)
- [SEO Configuration](seo.md)
- [Billing Setup](billing.md)
- [Configuration Options](configuration.md)

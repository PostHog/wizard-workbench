# Configuration Guide

Learn how to configure MVPable for your needs.

## Branding Configuration

All branding settings are centralized in `config/branding.php`. You can also use environment variables.

### Basic Branding

```php
// config/branding.php
return [
    'name' => env('BRAND_NAME', 'MVPable'),
    'legal_name' => env('BRAND_LEGAL_NAME', 'MVPable Inc.'),
    'tagline' => env('BRAND_TAGLINE', 'Ship a SaaS in days, not weeks.'),
    'description' => env('BRAND_DESCRIPTION', 'A modern SaaS starter kit.'),
    'url' => env('APP_URL', 'http://localhost'),
    'theme_color' => env('BRAND_THEME_COLOR', '#0b1220'),
];
```

### Brand Assets

```php
'assets' => [
    'logo' => '/images/brand/logo.svg',
    'logo_mark' => '/images/brand/mark.svg',
    'favicon' => '/images/brand/favicon.svg',
    'og_image' => '/og/default.svg',
],
```

### Social Media

```php
'social' => [
    'x' => env('BRAND_X_HANDLE'),
    'github' => env('BRAND_GITHUB_URL'),
    'linkedin' => env('BRAND_LINKEDIN_URL'),
],
```

### Support Information

```php
'support' => [
    'email' => env('BRAND_SUPPORT_EMAIL', 'support@example.com'),
    'phone' => env('BRAND_SUPPORT_PHONE'),
],
```

## SEO Configuration

### SEO Settings

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

See [SEO Guide](seo.md) for detailed SEO configuration.

## Environment Variables

### Application

```env
APP_NAME="Your SaaS Name"
APP_URL=http://localhost:8000
APP_ENV=local
APP_DEBUG=true
APP_TIMEZONE=UTC
```

### Database

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=mvpable
DB_USERNAME=root
DB_PASSWORD=
```

### Stripe

```env
STRIPE_KEY=pk_test_...
STRIPE_SECRET=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Mail

```env
MAIL_MAILER=smtp
MAIL_HOST=mailpit
MAIL_PORT=1025
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_ENCRYPTION=null
MAIL_FROM_ADDRESS="hello@example.com"
MAIL_FROM_NAME="${APP_NAME}"
```

## Cache Configuration

### Clear All Caches

```bash
php artisan optimize:clear
```

### Cache Configuration

```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

## Queue Configuration

### Queue Driver

Set in `.env`:

```env
QUEUE_CONNECTION=database
# or
QUEUE_CONNECTION=redis
```

### Run Queue Worker

```bash
php artisan queue:work
```

## Session Configuration

Sessions are configured in `config/session.php`. Default driver is `file`.

For production, consider using `database` or `redis`:

```env
SESSION_DRIVER=database
# or
SESSION_DRIVER=redis
```

## File Storage

Configure in `config/filesystems.php`. Default is `local`.

For production, use S3 or similar:

```env
FILESYSTEM_DISK=s3
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=your_bucket
```

## Logging

Logs are stored in `storage/logs/laravel.log`.

Configure in `config/logging.php`:

```php
'channels' => [
    'stack' => [
        'driver' => 'stack',
        'channels' => ['single', 'daily'],
    ],
    'single' => [
        'driver' => 'single',
        'path' => storage_path('logs/laravel.log'),
        'level' => env('LOG_LEVEL', 'debug'),
    ],
],
```

## Custom Configuration

### Adding Custom Config

1. Create config file: `config/custom.php`
2. Access via `config('custom.key')`
3. Cache: `php artisan config:cache`

### Environment-Specific Config

Use `.env` for environment-specific values:

```env
# .env.local
APP_ENV=local
APP_DEBUG=true

# .env.production
APP_ENV=production
APP_DEBUG=false
```

## Next Steps

- [SEO Configuration](seo.md)
- [Billing Setup](billing.md)
- [Deployment Guide](deployment.md)

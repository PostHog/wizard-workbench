# Installation Guide

This guide will walk you through installing and setting up MVPable on your local machine.

## Prerequisites

Before you begin, ensure you have the following installed:

- **PHP 8.3+** with extensions:
  - BCMath
  - Ctype
  - Fileinfo
  - JSON
  - Mbstring
  - OpenSSL
  - PDO
  - Tokenizer
  - XML
- **Composer** 2.x
- **Node.js** 18.x or higher and **npm**
- **MySQL 8.0+** or **PostgreSQL 13+**
- **Redis** (optional, for caching and queues)

## Step-by-Step Installation

### Step 1: Clone the Repository

```bash
git clone https://github.com/ismaelfi/MVPable.git
cd MVPable
```

### Step 2: Install PHP Dependencies

```bash
composer install
```

### Step 3: Install Node Dependencies

```bash
npm install
```

### Step 4: Set Up Environment

Run the setup command which will:
- Copy `.env.example` to `.env`
- Generate application key
- Set up the database
- Run migrations and seeders

```bash
php artisan dev:setup
```

**Manual Setup Alternative:**

If you prefer to set up manually:

```bash
# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Create database and update .env with your database credentials
# Then run migrations
php artisan migrate --seed
```

### Step 5: Configure Environment Variables

Edit `.env` file with your configuration:

```env
APP_NAME="Your SaaS Name"
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=mvpable
DB_USERNAME=root
DB_PASSWORD=

# Stripe Configuration (for billing)
STRIPE_KEY=your_stripe_key
STRIPE_SECRET=your_stripe_secret
STRIPE_WEBHOOK_SECRET=your_webhook_secret

# Branding Configuration
BRAND_NAME="Your SaaS Name"
BRAND_DESCRIPTION="Your SaaS description"
BRAND_SEO_TITLE="Your Site Name"
BRAND_SEO_DESCRIPTION="Your site description"
```

### Step 6: Configure Branding

Edit `config/branding.php` or set environment variables to customize your brand:

```php
'name' => env('BRAND_NAME', 'Your SaaS Name'),
'description' => env('BRAND_DESCRIPTION', 'Your SaaS description'),
'seo' => [
    'title' => env('BRAND_SEO_TITLE', 'Your Site Name'),
    'description' => env('BRAND_SEO_DESCRIPTION', 'Your site description'),
    'keywords' => ['keyword1', 'keyword2'],
],
```

### Step 7: Generate Sitemap

The sitemap is automatically generated daily, but generate it initially:

```bash
php artisan sitemap:generate
```

### Step 8: Build Assets

For development:
```bash
npm run dev
```

For production:
```bash
npm run build
```

### Step 9: Start Development Server

```bash
php artisan serve
```

Visit `http://localhost:8000` to see your application.

## Post-Installation

### Create Admin User

The seeder creates a default admin user. Check `database/seeders/UserSeeder.php` for credentials, or create your own:

```bash
php artisan tinker
```

```php
User::create([
    'name' => 'Admin',
    'email' => 'admin@example.com',
    'password' => Hash::make('password'),
]);
```

### Set Up Stripe (Optional)

1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Get your API keys from the Stripe Dashboard
3. Add them to your `.env` file
4. Set up webhooks pointing to `/webhook/stripe`

### Configure Queue (Optional)

For better performance, set up a queue worker:

```bash
php artisan queue:work
```

Or use Supervisor for production.

## Troubleshooting

### Permission Issues

If you encounter permission issues:

```bash
chmod -R 775 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache
```

### Database Connection Issues

- Verify database credentials in `.env`
- Ensure database exists
- Check database server is running

### Composer/Node Issues

- Clear caches: `composer clear-cache` and `npm cache clean --force`
- Delete `vendor/` and `node_modules/` and reinstall

## Next Steps

- [Configure SEO](seo.md)
- [Set up Billing](billing.md)
- [Customize Branding](configuration.md#branding-configuration)
- [Read the Quick Start Guide](quick-start.md)

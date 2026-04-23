# MVPable

MVPable is a comprehensive TALL (Tailwind CSS, Alpine.js, Laravel, Livewire) stack SaaS starter kit designed to accelerate the development of your SaaS products. With built-in features like Stripe checkout integration, user management, and a customizable admin panel, MVPable provides all the necessary components to launch your SaaS product quickly and efficiently.

## Features

### Admin Features

- **User Management**
  - User profiles and account settings
  - Activity logs

- **Subscription Management**
  - Stripe checkout integration
  - Subscription plans and billing cycles

- **Branding + SEO (config/branding.php)**
  - Single source for name, tagline, description, and support contacts
  - SEO defaults (title, description, keywords, OG, robots)
  - Brand assets (logo, mark, favicon, OG image)
  - **Advanced SEO Features** (see [SEO Documentation](docs/seo.md))
    - Google Sitelinks optimization (SiteNavigationElement, BreadcrumbList schemas)
    - Complete structured data (Organization, WebSite, Article, FAQPage)
    - Enhanced meta tags (Open Graph, Twitter Cards, Article metadata)
    - Automatic sitemap generation with lastmod dates
    - Optimized robots.txt
    - Performance optimizations (preconnect, dns-prefetch)

- **Manage Plans**
  - Brings your Stripe plans to create pricing cards
  - Stripe configuration

- **UI/UX Enhancements**
  - Easy custom theme setup

- **Security**

  - No disposable email (avoid spam and non-serious customers)

- **Development Tools**
  - CI/CD pipelines with GitHub Actions
  - One command setup (`php artisan dev:setup`)

### End User Features

- **Authentication and Authorization**
  - User registration, login, and password reset

- **UI/UX Enhancements**
  - Responsive design with Tailwind CSS & DaisyUI
  - Two ready themes: dark and light
  - 32 themes from DaisyUI

- **Miscellaneous**
  - **Production-ready SEO** - Complete SEO implementation with Google Sitelinks support
  - GDPR compliance tools

## Installation/Usage

### Prerequisites
- PHP 8.3+ with required extensions
- Composer 2.x
- Node.js 18.x+ and npm
- MySQL 8.0+ or PostgreSQL 13+
- Redis (optional, for caching and queues)

> **Quick Start?** See the [Quick Start Guide](docs/quick-start.md) to get up and running in 5 minutes!

### Installation

#### Step 1: Clone the Repository
```bash
git clone https://github.com/ismaelfi/MVPable.git
cd MVPable
```

#### Step 2: Install Dependencies
```bash
composer install
npm install
```

#### Step 3: Set Up Environment
```bash
php artisan dev:setup
```

This command will:
- Copy `.env.example` to `.env`
- Generate application key
- Set up the database
- Run migrations and seeders

**Manual Setup (if not using dev:setup):**
```bash
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan db:seed --class=PlanSeeder
```

#### Step 4: Configure Branding & SEO

Edit `config/branding.php` to customize your brand:

```php
'name' => env('BRAND_NAME', 'Your SaaS Name'),
'description' => env('BRAND_DESCRIPTION', 'Your SaaS description'),
'seo' => [
    'title' => env('BRAND_SEO_TITLE', 'Your Site Name'),
    'description' => env('BRAND_SEO_DESCRIPTION', 'Your site description'),
    'keywords' => ['keyword1', 'keyword2'],
],
```

Or set environment variables in `.env`:

```env
BRAND_NAME="Your SaaS Name"
BRAND_DESCRIPTION="Your SaaS description"
BRAND_SEO_TITLE="Your Site Name"
BRAND_SEO_DESCRIPTION="Your site description"
BRAND_SEO_ROBOTS="index,follow"
```

#### Step 5: Generate Sitemap

The sitemap is automatically generated daily, but you can generate it manually:

```bash
php artisan sitemap:generate
```

#### Step 6: Configure SEO (Optional but Recommended)

MVPable comes with **production-ready SEO** out of the box, including:

- ✅ Google Sitelinks optimization
- ✅ Complete structured data (JSON-LD)
- ✅ Enhanced meta tags (Open Graph, Twitter Cards)
- ✅ Automatic sitemap generation
- ✅ Optimized robots.txt

**For detailed SEO setup and usage, see the [Complete SEO Documentation](docs/seo.md)**

Quick examples:

**Basic SEO:**
```blade
<x-seo title="Page Title" description="Page description" />
```

**Article with breadcrumbs:**
```blade
<x-seo
    title="Article Title"
    description="Article description"
    type="article"
    :breadcrumbs="$breadcrumbs"
    :publishedTime="$publishedTime"
    author="Author Name"
/>
```

#### Step 7: Build Assets

```bash
npm run build
# or for development
npm run dev
```

#### Step 8: Start Development Server

```bash
php artisan serve
```

Visit `http://localhost:8000` to see your application.

---

## 📚 Documentation

Complete documentation is available in the [`docs/`](docs/) folder:

- **[📖 Documentation Index](docs/README.md)** - Start here for an overview
- **[🚀 Quick Start Guide](docs/quick-start.md)** - Get up and running in 5 minutes
- **[📥 Installation Guide](docs/installation.md)** - Detailed installation instructions
- **[⚙️ Configuration](docs/configuration.md)** - Configure branding, SEO, and more
- **[🔍 SEO Guide](docs/seo.md)** - Complete SEO implementation with Google Sitelinks
- **[💳 Billing & Subscriptions](docs/billing.md)** - Stripe integration guide

### SEO Features

MVPable includes **production-ready SEO** out of the box:

- ✅ Google Sitelinks optimization (SiteNavigationElement, BreadcrumbList schemas)
- ✅ Complete structured data (Organization, WebSite, Article, FAQPage)
- ✅ Enhanced meta tags (Open Graph, Twitter Cards, Article metadata)
- ✅ Automatic sitemap generation with lastmod dates
- ✅ Optimized robots.txt

**👉 See the [Complete SEO Documentation](docs/seo.md) for setup and usage**

## Contributing
We welcome contributions to improve MVPable! Please fork the repository and submit a pull request with your changes.

## License
This project is open-source and available under the [MIT license](https://opensource.org/licenses/MIT).

## Acknowledgements
MVPable is inspired by various open-source projects and built with love by the community. Special thanks to the creators and maintainers of Tailwind CSS, Alpine.js, Laravel, and Livewire.

## Support

If you find this project helpful, you can support its development in the following ways:

- **Buy me a coffee:** [Buy Me a Coffee](https://buymeacoffee.com/ismaelfi) or through [Revolut](https://revolut.me/ismaelfi)
- **Consulting:** Whether it's an MVP, website, or SaaS, I can help you launch your idea, fast. [Schedule a Consultation](https://cal.com/MVPable)
- **Share your creations:** Post what you've built using MVPable and mention me!


## Roadmap

- [x] Production-ready SEO with Google Sitelinks
- [x] Comprehensive documentation
- [ ] Create blog post with SEO
- [ ] Create free Landing page
- [ ] Enhance the admin panel with more features
- [ ] Add support for more payment gateways (LemonSqueezy)

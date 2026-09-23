# Django SaaS example app

A Django 3.0+ SaaS application for testing PostHog wizard integration. This app provides subscription billing, user authentication, and project management features.

## Running the app

### Prerequisites

- Python 3.10+
- SQLite (included with Python, used by default)
- Stripe account (optional, app runs in demo mode without it)

### Installation

1. Create and activate a virtual environment:

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

1. Install dependencies:

```bash
pip install -r requirements.txt
```

1. Set up environment variables (create a `.env` file):

```bash
SECRET_KEY=your-secret-key
# DATABASE_URL=postgresql://...  # Optional, defaults to SQLite
STRIPE_PUBLIC_KEY=pk_test_...    # Optional, enables Stripe
STRIPE_SECRET_KEY=sk_test_...    # Optional, enables Stripe
STRIPE_WEBHOOK_SECRET=whsec_...  # Optional, for webhooks
```

> **Note:** By default, the app uses SQLite (`db.sqlite3`) and runs in demo mode without Stripe. No additional setup is required for local development.

1. Initialize the database:

```bash
python manage.py migrate
python manage.py seed_plans  # Optional: seed pricing plans
```

1. Run the development server:

```bash
python manage.py runserver
```

The app will be available at `http://127.0.0.1:8000`.

---

## Application structure

```
├── manage.py             # Django management script
├── requirements.txt      # Python dependencies
├── accounts/             # User authentication & profiles
│   ├── models.py         # Custom User model
│   ├── views.py          # Login, register, password reset
│   └── forms.py          # Auth forms
├── billing/              # Subscription & payment handling
│   ├── models.py         # Plan, Subscription models
│   ├── views.py          # Stripe checkout, webhooks, billing portal
│   ├── admin.py          # Django admin customization
│   └── management/       # seed_plans command
├── config/               # Django settings
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
├── dashboard/            # Main app functionality
│   ├── models.py         # Project, ActivityLog models
│   ├── views.py          # Dashboard, project CRUD
│   └── forms.py
├── marketing/            # Public pages
│   └── views.py          # Home, features pages
├── static/               # CSS, JS, images
└── templates/            # HTML templates
```

## Features

### Authentication

- User registration with email
- Login/logout with session management
- Password reset via email
- User profiles and settings

### Billing & subscriptions

- Pricing page with plan tiers
- Stripe Checkout integration
- Subscription management (upgrade/downgrade/cancel)
- Stripe webhook handling
- Demo mode when Stripe is not configured

### Dashboard

- Project CRUD (create, read, update, delete)
- Activity logging
- Usage metrics display
- Subscription status

### Admin panel

- Django admin at `/admin/`
- Plan management with subscriber counts
- Subscription management with status badges

## Database models

| Model | Description |
|-------|-------------|
| `User` | Custom user model with authentication and Stripe customer ID |
| `Plan` | Subscription plans with pricing and Stripe price IDs |
| `Subscription` | User subscriptions with status tracking |
| `Project` | User projects with activity logging |
| `ActivityLog` | Audit trail for user actions |

## Key dependencies

- **Django** - Web framework
- **Stripe** - Payment processing
- **Whitenoise** - Static file serving
- **dj-database-url** - Database configuration from URL
- **python-dotenv** - Environment variable management

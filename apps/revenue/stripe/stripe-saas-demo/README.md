# Stripe SaaS Demo

A simple subscription SaaS app for testing Stripe + PostHog revenue analytics integration.

## Setup

### 1. Install dependencies

```bash
cd backend && npm install
cd ../frontend && npm install
```

### 2. Configure environment

Copy `.env.example` to both `.env` (root) and `frontend/.env`:

```bash
cp .env.example .env
cp .env.example frontend/.env
```

Fill in your Stripe test keys (from https://dashboard.stripe.com/test/apikeys) and PostHog API key.

### 3. Create Stripe products

This creates the Basic ($10/mo) and Pro ($25/mo) products and prices in your Stripe sandbox, and writes the price IDs to your `.env` files:

```bash
cd backend && npm run setup
```

### 4. (Optional) Set up Stripe webhooks

For the Checkout flow to fully work, set up a webhook endpoint. Using Stripe CLI:

```bash
stripe listen --forward-to localhost:3001/api/webhooks
```

Copy the webhook signing secret (`whsec_...`) into your `.env` as `STRIPE_WEBHOOK_SECRET`.

### 5. Run

In two terminals:

```bash
cd backend && npm run dev    # → http://localhost:3001
cd frontend && npm run dev   # → http://localhost:5173
```

## How it works

The app has two subscription flows:

1. **Stripe Checkout** — redirects to Stripe's hosted payment page
2. **Custom Card Form** — inline payment form using Stripe Elements

Both flows create a Stripe Customer and Subscription. PostHog JS is initialized in the frontend to track events and identify users.

## Test cards

Use Stripe's test cards:
- **Success**: `4242 4242 4242 4242`
- **Requires auth**: `4000 0025 0000 3155`
- **Declined**: `4000 0000 0000 0002`

Any future date and any 3-digit CVC will work.
